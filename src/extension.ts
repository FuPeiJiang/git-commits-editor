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

  commands.registerCommand('codelens-sample.commit', (currentRepo: string, commitMessage: string, commitTomlLine: number) => {
    const options = <SimpleGitOptions>{
      baseDir: currentRepo,
      binary: 'git',
      maxConcurrentProcesses: 1,
    }
    const git: SimpleGit = simpleGit(options)
    try {
      git.commit(commitMessage)
      window.showInformationMessage(`commited: ${commitMessage}`)
    } catch (error) {
      window.showInformationMessage(error)
    }

    const activeTextEditor = window.activeTextEditor
    if (!activeTextEditor) {
      return
    }
    const succeedded = activeTextEditor.edit(edit => {
      edit.insert(new Position(commitTomlLine, 7), 'ted') // insert 'ted' after '[commit'
    })
    if (!succeedded) {
      window.showInformationMessage('text insert failed')
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

    let dataStartLine = 0 //defaults to first line
    for (let i = selectedLine; i > -1; i--) {
      if (tomlRegExp.test(arr[i])) {
        dataStartLine = i + 1
        break
      }
    }

    let dataEndLine = arr.length - 1 //defaults to last line
    for (let i = selectedLine + 1, len = arr.length; i < len; i++) {
      if (tomlRegExp.test(arr[i])) {
        dataEndLine = i - 1
        break
      }
    }
    d(dataStartLine, dataEndLine)
    activeTextEditor.selection = new Selection(new Position(dataStartLine, 0), new Position(dataEndLine, arr[dataEndLine].length)) //arr[dataEndLine].length gets length till end of line

  })
}

// this method is called when your extension is deactivated
export function deactivate(): void {
  if (disposables) {
    disposables.forEach(item => item.dispose())
  }
  disposables = []
}