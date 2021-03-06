var d = console.debug.bind(console)

import { TextDocument, CodeLens, Range } from 'vscode'
import fs = require('fs')
import child_process = require('child_process')
import path = require('path')
import createRunThrough from './createRunThrough'

import type { CallbackIfEval, CallBackUntilOtherEval } from './createRunThrough'
import type { FuncAnyReturnCodeLensArr } from './CodelensProvider'

import { highlightArrOfLines } from './highlightArrOfLines'
import type { ArrOfLines } from './highlightArrOfLines'

type TypearrayOfToml = Array<[CallbackIfEval, CallBackUntilOtherEval]>

type CallbackFunctionString = (line: string) => string

type TypeStringToBool = (line: string) => boolean

type TypeNumberToVoid = (i: number) => void


export function createRangeGetter(): FuncAnyReturnCodeLensArr {
  let currentRepo = ''
  let commitMessage = ''
  let relativePaths: string[] = []
  let codeLenses: CodeLens[]
  let commitRange: Range | null = null
  const resetArrOfLines = () => {
    return {
      red: [],
      lime: [],
      committed: [],
    }
  }
  let arrOfLines: ArrOfLines = resetArrOfLines()
  const pendingRanges: { [color: string]: number } = {} //will be reassigned anyways
  for (const color in arrOfLines) {
    pendingRanges[color] = 0
  }
  let commitTomlLine: number
  const arrayOfToml: TypearrayOfToml = [
    [createCallIfToml(createStartsWith('[repo]'), (i: number): void => {
      currentRepo = ''
      pendingRanges.red = i
    }), ((line, whichImIn) => {
      const tempRepo = validGitRepo(line)
      if (tempRepo) {
        whichImIn[0] = null
        currentRepo = tempRepo
        arrOfLines.red.push(new Range(pendingRanges.red, 0, pendingRanges.red, 0))
      }
    }) as CallBackUntilOtherEval],

    [createCallIfToml(createStartsWith('[commit]'), (i: number): void => {
      if (currentRepo) {
        commitCodeLens()

        commitRange = new Range(i, 0, i, 0)
        arrOfLines.lime.push(commitRange)

        commitTomlLine = i
      }
      commitMessage = ''
    }), (line: string): void => {
      //append line
      commitMessage = `${commitMessage}\n${line}`
    }],

    [createCallIfToml(createStartsWith('[files]'), (): void => {
      relativePaths = []
    }), (line: string): void => {
      relativePaths.push(line)
    }],

    [createCallIfToml(createStartsWith('[committed]'), (i: number): void => {
      if (currentRepo) {
        commitCodeLens()
      }
      arrOfLines.committed.push(new Range(i, 0, i, 0))
    }), (): void => {
      return
    }],
  ]
  const runThrough = createRunThrough(arrayOfToml, createPreprocessorForOther())

  return (document: TextDocument): CodeLens[] => {
    arrOfLines = resetArrOfLines()
    codeLenses = []
    runThrough(document)
    commitCodeLens()
    highlightArrOfLines(arrOfLines)
    return codeLenses
  }

  function commitCodeLens() {

    if (commitRange !== null) {
      codeLenses.push(new CodeLens(commitRange, {
        title: 'Stage',
        command: 'codelens-sample.stage',
        arguments: [currentRepo, relativePaths],
      }))

      codeLenses.push(new CodeLens(commitRange, {
        title: 'Commit',
        command: 'codelens-sample.commit',
        arguments: [currentRepo, commitMessage, commitTomlLine],
      }))
      commitRange = null

    }
    commitMessage = ''
    relativePaths = []

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
    const regExprRepo = /(?<=^\\*)\\\[repo\]/
    const regExprCommit = /(?<=^\\*)\\\[commit\]`/
    const regExprFiles = /(?<=^\\*)\\\[files\]`/
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