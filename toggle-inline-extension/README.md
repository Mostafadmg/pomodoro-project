Toggle Inline Suggestions

Small VS Code extension to toggle the `editor.inlineSuggest.enabled` setting.

How to run

1. Open this workspace in VS Code.
2. Open the extension folder (`toggle-inline-extension`) in the Explorer and open the `package.json` or `extension.js` file.
3. Press F5 to launch the Extension Development Host. The command will be available as "Toggle Inline Suggestions".
4. To permanently install the extension, you can package it with `vsce` and install the resulting .vsix, or use `npm install -g vsce` then `vsce package`.

Keybinding

You can bind a key to the command `extension.toggleInlineSuggest` in your keybindings.json, for example:

{
"key": "ctrl+i",
"command": "extension.toggleInlineSuggest"
}
