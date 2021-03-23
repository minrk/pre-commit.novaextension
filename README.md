<!--
👋 Hello! As Nova users browse the extensions library, a good README can help them understand what your extension does, how it works, and what setup or configuration it may require.

Not every extension will need every item described below. Use your best judgement when deciding which parts to keep to provide the best experience for your new users.

💡 Quick Tip! As you edit this README template, you can preview your changes by selecting **Extensions → Activate Project as Extension**, opening the Extension Library, and selecting "pre-commit" in the sidebar.

Let's get started!
-->

<!--
🎈 Include a brief description of the features your extension provides. For example:
-->

**pre-commit** provides integration with [**pre-commit**](https://pre-commit.com),
for automatically linting / formatting your code.

This extension is not officially affiliated with or endorsed by the pre-commit project itself.

<!--
🎈 It can also be helpful to include a screenshot or GIF showing your extension in action:
-->

## Requirements

<!--
🎈 If your extension depends on external processes or tools that users will need to have, it's helpful to list those and provide links to their installers:
-->

pre-commit must be installed on your system:

```bash
pip install pre-commit
```

## Usage

<!--
🎈 If users will interact with your extension manually, describe those options:
-->

To run pre-commit manually on one or more files:

- Select the **Editor → pre-commit** menu item; or
- Open the command palette and type `pre-commit`

### Configuration

<!--
🎈 If your extension offers global- or workspace-scoped preferences, consider pointing users toward those settings. For example:
-->

To configure global preferences, open **Extensions → Extension Library...** then select pre-commit's **Preferences** tab.

You can also configure preferences on a per-project basis in **Project → Project Settings...**

Pre-commit can run automatically on save (for files with pre-commit config enabled).
This is disabled by default, but can be enabled in preferences.
If enabled, pre-commit will only run on files in a repo with a pre-commit config.

<!--
👋 That's it! Happy developing!

P.S. If you'd like, you can remove these comments before submitting your extension 😉
-->
