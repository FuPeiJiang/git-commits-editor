var d = console.debug.bind(console)

import { languages, commands, Disposable, workspace, window } from 'vscode'
import { CodelensProvider } from './CodelensProvider'
import { createRangeGetter } from './createRangeGetter'
let disposables: Disposable[] = []

import child_process = require('child_process')

import simpleGit, {SimpleGit, SimpleGitOptions} from 'simple-git'

export function activate(): void {

  const codelensProvider = new CodelensProvider(createRangeGetter())
  languages.registerCodeLensProvider({scheme: 'file', language: 'commits' }, codelensProvider)

  commands.registerCommand('codelens-sample.enableCodeLens', () => {
    workspace.getConfiguration('codelens-sample').update('enableCodeLens', true, true)
  })

  commands.registerCommand('codelens-sample.disableCodeLens', () => {
    workspace.getConfiguration('codelens-sample').update('enableCodeLens', false, true)
  })

  commands.registerCommand('codelens-sample.stage', (repoAndFullPath: [string,string[]]) => {
    const addCommand = `git add "${repoAndFullPath[1].join('" "')}"`
    try {
      child_process.execSync(addCommand, { cwd: repoAndFullPath[0] })

      window.showInformationMessage(`files staged: ${addCommand}`)
    } catch (error) {
      window.showInformationMessage(error)
    }

  })

  commands.registerCommand('codelens-sample.commit', (repoAndcommitMessage: [string, string]) => {
    const options = <SimpleGitOptions> {
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
}

// this method is called when your extension is deactivated
export function deactivate(): void {
  if (disposables) {
    disposables.forEach(item => item.dispose())
  }
  disposables = []
}