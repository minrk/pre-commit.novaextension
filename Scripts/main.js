const disposables = [];

exports.activate = function () {
  // Do work when the extension is activated
  // TODO: should we move this event watcher
  disposables.push(
    nova.workspace.onDidAddTextEditor((editor) => {
      editor.onDidSave(preCommitOnSave);
    }),
  );
  disposables.push(
    nova.config.onDidChange("pre-commit.preferPreK", () => {
      // changing prefer prek resets search
      foundPreCommit = null;
    }),
  );
};

exports.deactivate = function () {
  // Clean up state before the extension is deactivated
  while (disposables.length) {
    const d = disposables.pop();
    d.dispose();
  }
};

const preCommitCache = {};

function detectPreCommit(path) {
  // detect if a path has a preCommit config
  // walk up until we see .pre-commit-config.yaml or .git
  path = nova.path.normalize(path);
  if (preCommitCache[path]) return true;
  while (path !== "/") {
    if (nova.fs.stat(nova.path.join(path, ".pre-commit-config.yaml"))) {
      preCommitCache[path] = true;
      return true;
    }
    if (nova.fs.stat(nova.path.join(path, ".git"))) {
      return false;
    }
    path = nova.path.dirname(path);
  }
  return false;
}

function preCommitOnSave(editor) {
  if (!nova.config.get("pre-commit.runOnSave")) {
    return;
  }
  let path = nova.path.normalize(editor.document.path);
  if (!detectPreCommit(path)) {
    return;
  }
  preCommit(["--files", nova.path.basename(path)], nova.path.dirname(path));
}

let foundPreCommit = null;

async function preCommitExecutable() {
  let exe = nova.config.get("pre-commit.executable");
  if (exe) {
    return exe;
  }
  if (foundPreCommit) {
    return foundPreCommit;
  }
  let preferPreK = nova.config.get("pre-commit.preferPreK");
  let searchList = ["prek", "pre-commit"];
  if (!preferPreK) {
    searchList = ["pre-commit", "prek"];
  }
  for (exe of searchList) {
    console.log("looking for", exe);
    try {
      let result = await new Promise((resolve) => {
        const process = new Process("/usr/bin/env", { args: [exe, "-h"] });
        process.onDidExit(resolve);
        process.start();
      });
      if (result === 0) {
        console.log(`using executable: ${exe}`);
        foundPreCommit = exe;
        return exe;
      } else {
        console.log(`${exe} not found`);
      }
    } catch (e) {
      console.log(`error looking for ${exe}`, e);
    }
  }
  nova.workspace.showWarningMessage("Neither pre-commit nor prek found.");
  return null;
}

async function preCommit(args, cwd, showOnError = false) {
  const exe = await preCommitExecutable();
  if (!exe) {
    return;
  }
  var options = {
    args: [exe, "run"].concat(args),
    cwd: cwd,
  };
  console.log(options.args.join(" "));
  var process = new Process("/usr/bin/env", options);
  var lines = [];

  function collect(data) {
    if (data) {
      lines.push(data);
    }
  }
  process.onStdout(collect);
  process.onStderr(collect);

  process.onDidExit(function (status) {
    var string = `pre-commit exited with status ${status}:\n` + lines.join("");
    console.log(string);
    if (status && showOnError) {
      nova.workspace.showWarningMessage(string);
    }
  });

  process.start();
}

nova.commands.register("pre-commit.runAllFiles", (editor) => {
  preCommit(["--all-files"], nova.path.dirname(editor.document.path));
});

nova.commands.register("pre-commit.runCurrent", (editor) => {
  preCommit(
    ["--files", nova.path.basename(editor.document.path)],
    nova.path.dirname(editor.document.path),
  );
});
