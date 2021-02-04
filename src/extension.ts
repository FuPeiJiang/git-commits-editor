// import * as vscode from 'vscode'
import { languages, commands, Disposable, workspace, window, DocumentSelector } from 'vscode'
// import { ExtensionContext, languages, commands, Disposable, workspace, window, DocumentSelector } from 'vscode'
import { CodelensProvider } from './CodelensProvider'
let disposables: Disposable[] = []

export function activate() {
  // export function activate(context: ExtensionContext) {
  const codelensProvider = new CodelensProvider()

  //sel: DocumentFilter
  const sel: DocumentSelector = {scheme: 'file', language: 'commits' }

  languages.registerCodeLensProvider(sel, codelensProvider)

  commands.registerCommand('codelens-sample.enableCodeLens', () => {
    workspace.getConfiguration('codelens-sample').update('enableCodeLens', true, true)
  })

  commands.registerCommand('codelens-sample.disableCodeLens', () => {
    workspace.getConfiguration('codelens-sample').update('enableCodeLens', false, true)
  })

  commands.registerCommand('codelens-sample.codelensAction', (args: any) => {
    window.showInformationMessage(`CodeLens action clicked with args=${args}`)
  })
}

// this method is called when your extension is deactivated
export function deactivate() {
  if (disposables) {
    disposables.forEach(item => item.dispose())
  }
  disposables = []
}