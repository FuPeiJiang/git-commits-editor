var d = console.debug.bind(console)

import { languages, commands, Disposable, workspace, window, Selection, Position } from 'vscode'
import { CodelensProvider } from './CodelensProvider'
import { createRangeGetter } from './createRangeGetter'
let disposables: Disposable[] = []

import child_process = require('child_process')

import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git'

export function activate(): void {

  const codelensProvider = new CodelensProvider(createRangeGetter())
  languages.registerCodeLensProvider({ scheme: 'file', language: 'commits' }, codelensProvider)

  commands.registerCommand('codelens-sample.enableCodeLens', () => {
    workspace.getConfiguration('codelens-sample').update('enableCodeLens', true, true)
  })

  commands.registerCommand('codelens-sample.disableCodeLens', () => {
    workspace.getConfiguration('codelens-sample').update('enableCodeLens', false, true)
  })

  commands.registerCommand('codelens-sample.stage', (repoAndFullPath: [string, string[]]) => {
    const addCommand = `git add "${repoAndFullPath[1].join('" "')}"`
    try {
      child_process.execSync(addCommand, { cwd: repoAndFullPath[0] })

      window.showInformationMessage(`files staged: ${addCommand}`)
    } catch (error) {
      window.showInformationMessage(error)
    }

  })

  commands.registerCommand('codelens-sample.commit', (repoAndcommitMessage: [string, string]) => {
    const options = <SimpleGitOptions>{
      baseDir: repoAndcommitMessage[0],
      binary: 'git',
      maxConcurrentProcesses: 1,
    }

    const git: SimpleGit = simpleGit(options)

    try {
      git.commit(repoAndcommitMessage[1])

      window.showInformationMessage(`commited: ${repoAndcommitMessage[1]}`)
    } catch (error) {
      window.showInformationMessage(error)

    }

  })

  commands.registerCommand('git-commits-editor.selectTOMLBlock', () => {
    const activeTextEditor = window.activeTextEditor
    if (!activeTextEditor) {
      return
    }
    const selectedLine = activeTextEditor.selection.active.line
    const arr = activeTextEditor.document.getText().split('\n')

    const tomlRegExp = new RegExp(String.raw`^\[[a-zA-Z\.-]+\](?!\])|^\[\[[a-zA-Z\.-]+\]\]`)

    //look up for TOML (look until top of document) (start at selected line), then look down for TOML

    let dataStartLine = 1
    //we don't even need to loop to 0, because 0 by default
    for (let i = selectedLine; i > 0; i--) {
      if (tomlRegExp.test(arr[i])) {
        dataStartLine = i + 1
        break
      }
    }

    let dataEndLine = arr.length
    for (let i = selectedLine + 1, len = dataEndLine - 1; i < len; i++) {
      if (tomlRegExp.test(arr[i])) {
        dataEndLine = i - 1
        break
      }
    }

    activeTextEditor.selection = new Selection(new Position(dataStartLine,0), new Position(dataEndLine,arr[dataEndLine].length)) //arr[dataEndLine].length gets length till end of line

  })
}

// this method is called when your extension is deactivated
export function deactivate(): void {
  if (disposables) {
    disposables.forEach(item => item.dispose())
  }
  disposables = []
}