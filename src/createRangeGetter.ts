

import { TextDocument, CodeLens, Range, Command } from 'vscode'
import fs = require('fs')
import child_process = require('child_process')
import path = require('path')
import createRunThrough from './createRunThrough'

import type { CallbackIfEval, CallBackUntilOtherEval } from './createRunThrough'
import type { FuncAnyReturnCodeLensArr } from './CodelensProvider'

// type CallbackIfEval = (line: string) => boolean
// type CallBackUntilOtherEval = (line: string, whichImIn: [number | null], i: number) => void

type TypearrayOfToml = Array<[CallbackIfEval, CallBackUntilOtherEval]>

type CallbackFunctionString = (line: string) => string

type TypeStringToBool = (line: string) => boolean
// type TypeStringToVoid = (line: string) => void
type TypeNumberToVoid = (i: number) => void

var d = console.debug.bind(console)

export function createRangeGetter(): FuncAnyReturnCodeLensArr {
  let currentRepo = ''
  let commitMessage = ''
  let relativePaths: string[] = []
  // let arrayOfToml: TypearrayOfToml
  let codeLenses: CodeLens[]

  const arrayOfToml: TypearrayOfToml = [
    [createCallIfToml(createStartsWith('[repo]'), (): void => {
      currentRepo = ''
    }), ((line, whichImIn) => {
      // }), <CallBackUntilOtherEval>(line: string, whichImIn: [number | null]): void => {
      const tempRepo = validGitRepo(line)
      if (tempRepo) {
        d('currentRepo', tempRepo)
        whichImIn[0] = null
        currentRepo = tempRepo
      }
    }) as CallBackUntilOtherEval],

    [createCallIfToml(createStartsWith('[commit]'), (i: number): void => {
      commitMessage = ''
      d('commit')
      if (currentRepo) {
        const range = new Range(i, 0, i + 1, 0)

        const command: Command = {
          title: 'Codelens provided by sample extension',
          command: 'codelens-sample.codelensAction',
          arguments: ['stonks'],
        }

        codeLenses.push(new CodeLens(range, command))
      }
    }), (line: string): void => {
      commitMessage = `${commitMessage}\n${line}`
    }],

    [createCallIfToml(createStartsWith('[files]'), (): void => {
      relativePaths = []
      d('files')
      d(commitMessage)
    }), (line: string): void => {
      const fullPath = path.join(currentRepo, line)
      if (validFile(fullPath)) {
        relativePaths.push(fullPath)
      }
    }],
    // [ createCallIfToml(createStartsWith('[repo]'),(): void=>{
    // currentRepo = ''
    // }), repoLineHere.bind(this)],
  ]
  const runThrough = createRunThrough(arrayOfToml, createPreprocessorForOther())


  // return getRanges(document: TextDocument): CodeLens[] => {
  return (document: TextDocument): CodeLens[] => {
    codeLenses = []
    runThrough(document)
    d(relativePaths)
    return codeLenses
  }

  function createCallIfToml(ifFunc: TypeStringToBool, callback: TypeNumberToVoid) {
    return (line: string, i: number): boolean => {
      const trueFalse = ifFunc(line)
      if (trueFalse) {
        // if (trueFalse && callback && typeof callback === 'function') {
        callback(i)
      }
      return trueFalse
    }
  }

  function createStartsWith(testStr: string): TypeStringToBool {
    return function(line: string): boolean {
      return line.startsWith(testStr)
    }
  }

  function createPreprocessorForOther(): CallbackFunctionString {
    const regExprRepo = new RegExp(String.raw`(?<=^\\*)\\\[repo\]`)
    const regExprCommit = new RegExp(String.raw`(?<=^\\*)\\\[commit\]`)
    const regExprFiles = new RegExp(String.raw`(?<=^\\*)\\\[files\]`)
    const strRepo = String.raw`[repo]`
    const strCommit = String.raw`[commit]`
    const strFiles = String.raw`[files]`
    return function(line: string): string {
      return line.replace(regExprRepo, strRepo)
        .replace(regExprCommit, strCommit)
        .replace(regExprFiles, strFiles)
    }
  }

}




function validFile(string: string): boolean {
  try {
    //lstatSync will throw if doesn't exist
    const stats = fs.lstatSync(string)
    if (stats.isFile()) {
      return true
    } else {
      return false
    }
  } catch (e) {
    return false
  }
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