import { CodeLensProvider, TextDocument, CodeLens, workspace } from 'vscode'
import { CallbackIfEval, CallBackUntilOtherEval } from './createRunThrough'
// import * as vscode from 'vscode'
/**
 * CodelensProvider
 */

type FuncAnyReturnCodeLensArr = (...args: any[]) => CodeLens[]
export type { FuncAnyReturnCodeLensArr }
// type CallbackFunctionVariadicReturnCodeLens = (...args: any[]) => CodeLens[] | Thenable<CodeLens[]>

export class CodelensProvider implements CodeLensProvider {
  getRanges: FuncAnyReturnCodeLensArr

  // private regex: RegExp
  // private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>()
  // public readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event

  constructor(getRanges: FuncAnyReturnCodeLensArr) {
    this.getRanges = getRanges
    // this.regex = /(.+)/g

  //   workspace.onDidChangeConfiguration(() => {
  // this._onDidChangeCodeLenses.fire()
  //   })
  }

  public provideCodeLenses(document: TextDocument): CodeLens[] | Thenable<CodeLens[]> {
    // public provideCodeLenses(document: TextDocument, token: vscode.CancellationToken): CodeLens[] | Thenable<CodeLens[]> {

    if (workspace.getConfiguration('codelens-sample').get('enableCodeLens', true)) {
      return this.getRanges(document)
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
  */
}