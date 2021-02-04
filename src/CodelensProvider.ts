import { CodeLensProvider, TextDocument, CodeLens, workspace } from 'vscode'
// import * as vscode from 'vscode'
import { getRanges } from './parser'
/**
 * CodelensProvider
 */
export class CodelensProvider implements CodeLensProvider {

  // private regex: RegExp
  // private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>()
  // public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event

  //   constructor() {
  // this.regex = /(.+)/g

  //   workspace.onDidChangeConfiguration(() => {
  // this._onDidChangeCodeLenses.fire()
  //   })
  //   }

  public provideCodeLenses(document: TextDocument): CodeLens[] | Thenable<CodeLens[]> {
    // public provideCodeLenses(document: TextDocument, token: vscode.CancellationToken): CodeLens[] | Thenable<CodeLens[]> {

    if (workspace.getConfiguration('codelens-sample').get('enableCodeLens', true)) {
      return getRanges(document)
    }
    return []
  }

/*   public resolveCodeLens(codeLens: CodeLens): CodeLens|null {
  // public resolveCodeLens(codeLens: CodeLens, token: vscode.CancellationToken) {
    if (workspace.getConfiguration('codelens-sample').get('enableCodeLens', true)) {
      console.log(codeLens.range)

      codeLens.command = {
        title: 'Codelens provided by sample extension',
        command: 'codelens-sample.codelensAction',
        arguments: 'Argument 1',
      }
      return codeLens
    }
    return null
  }
} */