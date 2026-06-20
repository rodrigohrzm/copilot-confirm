import * as vscode from 'vscode';

let suppressionActive = false;
let sessionDisabled = false;
let statusBarItem: vscode.StatusBarItem;

function showStatusBar() {
	statusBarItem.show();
}

function hideStatusBar() {
	statusBarItem.hide();
}

export function activate(context: vscode.ExtensionContext) {
	statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 0);
	statusBarItem.text = '$(shield-x) Confirm OFF';
	statusBarItem.tooltip = 'Copilot Confirm is suppressed — click to re-enable';
	statusBarItem.command = 'copilotConfirm.reEnable';
	context.subscriptions.push(statusBarItem);

	const surfaces = [
		{ command: 'copilotConfirm.interceptChatPanel', setting: 'surfaces.chatPanel', originalCommand: 'workbench.action.chat.submit' },
		{ command: 'copilotConfirm.interceptQuickChat', setting: 'surfaces.quickChat', originalCommand: 'workbench.action.chat.submit' },
		{ command: 'copilotConfirm.interceptInlineChat', setting: 'surfaces.inlineChat', originalCommand: 'workbench.action.chat.submit' },
		{ command: 'copilotConfirm.interceptTerminalChat', setting: 'surfaces.terminalChat', originalCommand: 'workbench.action.chat.submit' },
		{ command: 'copilotConfirm.interceptChatPanelEditMode', setting: 'surfaces.chatPanel', originalCommand: 'workbench.action.edits.submit' },
		{ command: 'copilotConfirm.interceptQuickChatEditMode', setting: 'surfaces.quickChat', originalCommand: 'workbench.action.edits.submit' },
		{ command: 'copilotConfirm.interceptInlineChatEditMode', setting: 'surfaces.inlineChat', originalCommand: 'workbench.action.edits.submit' },
		{ command: 'copilotConfirm.interceptTerminalChatEditMode', setting: 'surfaces.terminalChat', originalCommand: 'workbench.action.edits.submit' },
		{ command: 'copilotConfirm.interceptSubmitWithCodebase', setting: null, originalCommand: 'workbench.action.chat.submitWithCodebase' },
		{ command: 'copilotConfirm.interceptSendToNewChat', setting: null, originalCommand: 'workbench.action.chat.sendToNewChat' },
		{ command: 'copilotConfirm.interceptSubmitWithoutDispatching', setting: null, originalCommand: 'workbench.action.chat.submitWithoutDispatching' },
	];

	for (const { command, setting, originalCommand } of surfaces) {
		context.subscriptions.push(
			vscode.commands.registerCommand(command, () => handleIntercept(setting, originalCommand))
		);
	}

	context.subscriptions.push(
		vscode.commands.registerCommand('copilotConfirm.reEnable', () => {
			suppressionActive = false;
			sessionDisabled = false;
			hideStatusBar();
			vscode.window.showInformationMessage('Copilot Confirm: Confirmation re-enabled.');
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('copilotConfirm.disableSession', () => {
			sessionDisabled = true;
			showStatusBar();
			vscode.window.showInformationMessage('Copilot Confirm: Confirmation disabled for this session.');
		})
	);
}

async function handleIntercept(surfaceSetting: string | null, originalCommand: string): Promise<void> {
	const config = vscode.workspace.getConfiguration('copilotConfirm');

	if (
		!config.get<boolean>('enabled', true) ||
		(surfaceSetting && !config.get<boolean>(surfaceSetting, true)) ||
		sessionDisabled ||
		suppressionActive
	) {
		await vscode.commands.executeCommand(originalCommand);
		return;
	}

	const result = await vscode.window.showWarningMessage(
		'Confirm you want to send the message',
		{ modal: true },
		'Send',
		'Always send for this window'
	);

	if (result === 'Send') {
		await vscode.commands.executeCommand(originalCommand);
	} else if (result === 'Always send for this window') {
		suppressionActive = true;
		showStatusBar();
		await vscode.commands.executeCommand(originalCommand);
	}
}

export function deactivate() {}
