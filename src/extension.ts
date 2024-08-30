import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('go-errutil.return', () => {
		// vscode.window.showInformationMessage('yas!');
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const document = editor.document;
    const position = editor.selection.active;

    const line = document.lineAt(position.line);
    const indent = line.text.match(/^\s*/)?.[0] || '';

    const snippet = new vscode.SnippetString(
      `return ${getReturnStatementPlaceholder()}`
    );

    editor.insertSnippet(snippet, position);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}

function getReturnStatementPlaceholder(): string {
  return '${2:bar{}}, ${3:nil}, errutil.With(err)';
}
