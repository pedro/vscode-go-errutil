import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('go-errutil.return', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const document = editor.document;
    const position = editor.selection.active;

    const textBeforeCursor = document.getText(new vscode.Range(new vscode.Position(0, 0), position));

    const funcRegex = /func\s+(\([^)]+\)\s+)?\w+\s*\([^)]*\)\s*(\([^)]+\)|\w+)?/g;
    let match;
    let lastFuncMatch = null;

    while ((match = funcRegex.exec(textBeforeCursor)) !== null) {
      lastFuncMatch = match;
    }

    if (!lastFuncMatch) {
      vscode.window.showErrorMessage('No function definition found above the cursor.');
      return;
    }

    const returnTypes = extractReturnTypes(lastFuncMatch[2]);

    if (returnTypes.length === 0 || returnTypes[returnTypes.length - 1] !== 'error') {
      vscode.window.showErrorMessage('Function does not return error');
      return;
    }
    let emptyValues = returnTypes.slice(0, -1).map(type => getZeroValueForType(type)).join(', ');
    if (emptyValues.length > 0) {
      emptyValues += ', ';
    }

    const snippet = new vscode.SnippetString(`return ${emptyValues}errutil.With(err)`);
    editor.insertSnippet(snippet, position);
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}

function extractReturnTypes(signature: string | undefined): string[] {
  if (!signature) {
    return [];
  }

  // Remove parentheses if present
  signature = signature.trim();
  if (signature.startsWith('(') && signature.endsWith(')')) {
    signature = signature.slice(1, -1);
  }

  // Split the signature into individual types
  return signature.split(',').map(type => type.trim().replace(/([\w\d]+\s)/g, ''));
}

function getZeroValueForType(type: string): string {
  switch (type) {
    case 'int':
    case 'float64':
    case 'float32':
    case 'uint':
    case 'uint8':
    case 'uint16':
    case 'uint32':
    case 'uint64':
      return '0';
    case 'string':
      return '""';
    case 'bool':
      return 'false';
    default:
      if (type.endsWith('[]')) {
        return 'nil';
      }
      return 'nil'; // Default for pointers, slices, maps, etc.
  }
}
