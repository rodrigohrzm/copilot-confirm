# Copilot Confirm

Adds a confirmation dialog before sending messages to Copilot Chat, creating friction to prevent accidental message submissions that waste tokens.

## Features

- **Modal confirmation** on Enter in all chat surfaces (panel, quick chat, inline chat, terminal chat)
- **Per-surface configuration** — enable/disable confirmation for each chat surface independently
- **Intercept all shortcuts** — optionally confirm Ctrl+Enter, Ctrl+Shift+Enter, and Alt+Shift+Enter too
- **"Always send for this window"** — suppress the dialog for the rest of the current window session
- **Re-enable command** — restore the confirmation dialog via Command Palette
- **Disable for session** — turn off confirmation for the entire VS Code window lifetime

### Known Limitations

- **"Always send for this window" is per-window, not per-conversation.** VS Code does not expose an API to detect when a new conversation starts. Use the `Copilot Confirm: Re-enable Confirmation` command to restore the dialog manually after starting a new conversation.
- **Send button not intercepted.** The confirmation dialog only triggers when submitting via keyboard shortcuts. Clicking the send button in the chat UI bypasses the confirmation. This is a VS Code API limitation — extensions cannot intercept built-in UI button clicks. If you want full coverage, rely on keyboard shortcuts for submissions.


### Commands

| Command | Description |
|---------|-------------|
| `Copilot Confirm: Re-enable Confirmation` | Resets the "Don't Ask Again" suppression |
| `Copilot Confirm: Disable for This Session` | Suppresses confirmation until VS Code window is reloaded |

### Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `copilotConfirm.enabled` | `true` | Master toggle |
| `copilotConfirm.surfaces.chatPanel` | `true` | Enable for chat panel and editor tab chat |
| `copilotConfirm.surfaces.quickChat` | `true` | Enable for quick Chat overlay |
| `copilotConfirm.surfaces.inlineChat` | `true` | Enable for inline Chat |
| `copilotConfirm.surfaces.terminalChat` | `true` | Enable for terminal Chat |
| `copilotConfirm.interceptAllShortcuts` | `false` | Also show confirmation when submitting via Ctrl+Enter, Ctrl+Shift+Enter, and Alt+Shift+Enter |

## Agents Window Support

The extension runs in every possible chat surface in the **regular VSCode window**.

Although initially this extension was made to work in the VS Code **Agents window** (the agent-first development window introduced in VS Code 1.122), as of version 1.125.1 it seems **it's no longer possible**.

The extension can be made to run in the Agents window, and its keyboard bindings are registered, but they cannot not override the built-in commands in the window. It seems to be because the Agents window runs in its own special profile "agents", which is not as open as the regular VSCode window.

If someone finds a way to make it work in the Agents window, i'll be more than happy to update the extension to support it. For now, the extension works in all other chat surfaces in the regular VSCode window.

### How to enable the extension in Agents window

VSCode does not enable it in the Agents window automatically — you must opt in via a one-time setting.

1. Open **Settings** in VS Code
2. Search for **Extensions: Support Agents Window**
3. Click **Add Item** and enter:
   - **Key:** `rodrigohrzm.copilot-confirm`
   - **Value:** `true`

Or add it directly to your `settings.json`:

```json
"extensions.supportAgentsWindow": {
    "rodrigohrzm.copilot-confirm": true
}
```

Once enabled, the extension will show up as running and its keyboard bindings will appear in the table, but the confirmation popup will still not appear in the Agents window.
