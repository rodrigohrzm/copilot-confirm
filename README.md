# Copilot Confirm

Adds a confirmation dialog before sending messages to Copilot Chat, creating friction to prevent accidental message submissions that waste tokens.

## Agents Window Support

This extension can be made to work in the VS Code **Agents window** (the agent-first development window introduced in VS Code 1.122).
Because the extension contains code, VS Code does not enable it in the Agents window automatically — you must opt in via a one-time setting.

### How to enable the extension in Agents window

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

Once enabled, the extension behaves identically in the Agents window — the same confirmation dialog, settings, and commands all apply.

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
