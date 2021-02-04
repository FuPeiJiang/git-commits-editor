import { TextDocument, CodeLens, Range, Command } from 'vscode'
import fs = require('fs')
import child_process = require('child_process')
import path = require('path')
// const regexAndStr = {
// repo: {regex: new RegExp(String.raw`\\\[repo\]`, 'g'), str:'[repo]'},
// commit: {regex: new RegExp(String.raw`\\\[commit\]`, 'g'), str:'[commit]'},
// files: {regex: new RegExp(String.raw`\\\[files\\]`, 'g'), str:'[files]'},
// }

const regExprRepo = new RegExp(String.raw`\\\[repo\]`, 'g')
const regExprCommit = new RegExp(String.raw`\\\[commit\]`, 'g')
const regExprFiles = new RegExp(String.raw`\\\[files\]`, 'g')
const strRepo = '[repo]'
const strCommit = '[commit]'
const strFiles = '[files]'

export function getRanges(document: TextDocument): CodeLens[] {
  const codeLenses: CodeLens[] = []
  //   const regex = new RegExp(this.regex)
  const text = document.getText()
  //   let matches
  const arr: string[] = text.split('\n')

  let currentRepo = ''
  let didNotCatchRepo = false
  let whichImIn = ''
  let skipping = false
  for (let i = 0, len = arr.length; i < len; i++) {
    const line: string = arr[i]
    console.log(line)

    if (line.startsWith(strRepo)) {
      whichImIn = strRepo
      //give it a chance to catch a repo (in else, before hitting a [commit] or [files])
      didNotCatchRepo = false
      skipping = false
    } else if (!didNotCatchRepo) {
      if (line.startsWith(strCommit)) {
        whichImIn = strCommit
        if (currentRepo) {
          const range = new Range(i, 0, i + 1, 0)

          const command: Command = {
            title: 'Codelens provided by sample extension',
            command: 'codelens-sample.codelensAction',
            arguments: ['stonks'],
          }

          codeLenses.push(new CodeLens(range, command))
        } else if (!currentRepo) {
          didNotCatchRepo = true
        }
        skipping = false
      } else if (line.startsWith(strFiles)) {
        whichImIn = strFiles
        if (!currentRepo) {
          didNotCatchRepo = true
        }
        skipping = false
      } else if (!skipping) {

        if (whichImIn === strRepo) {
          console.log('REEEE', i, ':', line)

          currentRepo = validGitRepo(line)

          if (currentRepo) {
            console.log('okkkkk', i, ':', currentRepo)
            whichImIn = ''
            skipping = true
          }
        }
        // else if (whichImIn === strCommit) {
        //
        // }
        // else if (whichImIn === strFiles) {
        //
        // }



        // line = line.replace(regExprRepo, strRepo)
        // line = line.replace(regExprCommit, strCommit)
        // line = line.replace(regExprFiles, strFiles)
      }
    }

  }
  // console.log('ok')

  //   while ((matches = regex.exec(text)) !== null) {
  // const line = document.lineAt(document.positionAt(matches.index).line)
  // const indexOf = line.text.indexOf(matches[0])
  // const position = new vscode.Position(line.lineNumber, indexOf)
  // const range = document.getWordRangeAtPosition(position, new RegExp(this.regex))
  // if (range) {
  //   this.codeLenses.push(new vscode.CodeLens(range))
  // }
  //   }
  console.log(codeLenses)
  return codeLenses
}

function validGitRepo(string: string): string {
  let dirToCheck: string
  try {
    //lstatSync will throw if doesn't exist
    const stats = fs.lstatSync(string)
    if (stats.isDirectory()) {
      dirToCheck = string
    } else if (stats.isFile()) {
      dirToCheck = path.dirname(string)
    } else {
      return ''
    }
  } catch (e) {
    return ''
  }

  try {
    //execSync will throw if non-zero exit code
    const gitRoot = child_process.execSync('git rev-parse --show-toplevel', { cwd: dirToCheck })
      .toString().slice(0, -1)
    return gitRoot ? gitRoot : ''
  } catch (e) {
    return ''
  }
}