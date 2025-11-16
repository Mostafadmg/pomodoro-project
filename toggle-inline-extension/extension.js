const vscode = require("vscode");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "extension.toggleInlineSuggest",
    async function () {
      try {
        const config = vscode.workspace.getConfiguration("editor");
        const current = config.get("inlineSuggest.enabled");
        // toggle
        await config.update(
          "inlineSuggest.enabled",
          !current,
          vscode.ConfigurationTarget.Global
        );
        vscode.window.showInformationMessage(
          `Inline suggestions ${!current ? "enabled" : "disabled"}`
        );
      } catch (err) {
        vscode.window.showErrorMessage(
          "Failed to toggle inline suggestions: " + String(err)
        );
      }
    }
  );

  context.subscriptions.push(disposable);

  // command to toggle Copilot inline suggestions (robust to different Copilot setting names)
  let disposableCopilot = vscode.commands.registerCommand(
    "extension.toggleCopilotInline",
    async function () {
      try {
        // candidate setting keys under the 'github.copilot' namespace
        const ns = "github.copilot";
        const config = vscode.workspace.getConfiguration(ns);
        const candidates = [
          "inlineSuggest.enabled",
          "inlineSuggest",
          "enableInlineSuggest",
          "inlineSuggestions",
          "inlineSuggestEnabled",
          "enable",
        ];

        let foundKey = null;
        let currentVal = undefined;
        for (const key of candidates) {
          const val = config.get(key);
          if (typeof val !== "undefined") {
            foundKey = key;
            currentVal = val;
            break;
          }
        }

        if (!foundKey) {
          // try top-level github.copilot settings if the namespace is different
          const altConfig = vscode.workspace.getConfiguration("github");
          for (const key of candidates) {
            const val = altConfig.get(`copilot.${key}`);
            if (typeof val !== "undefined") {
              foundKey = `copilot.${key}`;
              currentVal = val;
              break;
            }
          }
        }

        if (!foundKey) {
          vscode.window.showErrorMessage(
            "Could not find a Copilot inline-suggestions setting to toggle. Please copy the setting ID from Settings and I can add it."
          );
          return;
        }

        // determine which config object to update
        const updateTarget = foundKey.startsWith("copilot.")
          ? vscode.workspace.getConfiguration("github")
          : vscode.workspace.getConfiguration("github.copilot");
        await updateTarget.update(
          foundKey.replace(/^copilot\./, ""),
          !currentVal,
          vscode.ConfigurationTarget.Global
        );
        vscode.window.showInformationMessage(
          `Copilot inline suggestions ${!currentVal ? "enabled" : "disabled"}`
        );
      } catch (err) {
        vscode.window.showErrorMessage(
          "Failed to toggle Copilot inline suggestions: " + String(err)
        );
      }
    }
  );

  context.subscriptions.push(disposableCopilot);

  // combined toggle: editor.inlineSuggest + Copilot inline (if present)
  let disposableAll = vscode.commands.registerCommand(
    "extension.toggleAllInline",
    async function () {
      try {
        // toggle editor inline suggestions
        const editorConfig = vscode.workspace.getConfiguration("editor");
        const editorCurrent = editorConfig.get("inlineSuggest.enabled");
        await editorConfig.update(
          "inlineSuggest.enabled",
          !editorCurrent,
          vscode.ConfigurationTarget.Global
        );

        // now attempt to toggle Copilot using the same logic as disposableCopilot
        const ns = "github.copilot";
        const config = vscode.workspace.getConfiguration(ns);
        const candidates = [
          "inlineSuggest.enabled",
          "inlineSuggest",
          "enableInlineSuggest",
          "inlineSuggestions",
          "inlineSuggestEnabled",
          "enable",
        ];

        let foundKey = null;
        let currentVal = undefined;
        for (const key of candidates) {
          const val = config.get(key);
          if (typeof val !== "undefined") {
            foundKey = key;
            currentVal = val;
            break;
          }
        }

        if (!foundKey) {
          const altConfig = vscode.workspace.getConfiguration("github");
          for (const key of candidates) {
            const val = altConfig.get(`copilot.${key}`);
            if (typeof val !== "undefined") {
              foundKey = `copilot.${key}`;
              currentVal = val;
              break;
            }
          }
        }

        if (foundKey) {
          const updateTarget = foundKey.startsWith("copilot.")
            ? vscode.workspace.getConfiguration("github")
            : vscode.workspace.getConfiguration("github.copilot");
          await updateTarget.update(
            foundKey.replace(/^copilot\./, ""),
            !currentVal,
            vscode.ConfigurationTarget.Global
          );
          vscode.window.showInformationMessage(
            `Editor inline: ${!editorCurrent ? "enabled" : "disabled"}; Copilot inline: ${
              !currentVal ? "enabled" : "disabled"
            }`
          );
        } else {
          vscode.window.showInformationMessage(
            `Editor inline: ${
              !editorCurrent ? "enabled" : "disabled"
            }; Copilot inline: (not found)`
          );
        }
      } catch (err) {
        vscode.window.showErrorMessage(
          "Failed to toggle inline suggestions: " + String(err)
        );
      }
    }
  );

  context.subscriptions.push(disposableAll);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
