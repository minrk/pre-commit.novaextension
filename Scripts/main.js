exports.activate = function () {
  // Do work when the extension is activated
  // TODO: should we move this event watcher
  nova.workspace.onDidAddTextEditor((editor) => {
    editor.onDidSave(preCommitOnSave);
  });
};

exports.deactivate = function () {
  // Clean up state before the extension is deactivated
  // how do I unregister onDidAddTextEditor
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

function preCommit(args, cwd, showOnError = false) {
  var options = {
    args: ["pre-commit", "run"].concat(args),
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
    nova.path.dirname(editor.document.path)
  );
});
