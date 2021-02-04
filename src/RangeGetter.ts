

import { TextDocument, CodeLens, Range, Command } from 'vscode'
import fs = require('fs')
import child_process = require('child_process')
import path = require('path')
import createRunThrough from './createRunThrough'

import type { CallbackIfEval, CallBackUntilOtherEval } from './createRunThrough'
// type CallbackIfEval = (line: string) => boolean
// type CallBackUntilOtherEval = (line: string, whichImIn: [number | null], i: number) => void

type TypearrayOfToml = Array<[CallbackIfEval, CallBackUntilOtherEval]>

type CallbackFunctionString = (line: string) => string

type TypeGetRanges = (document: TextDocument) => CodeLens[]

type TypeStringToBool = (line: string) => boolean
// type TypeStringToVoid = (line: string) => void
type TypeNumberToVoid = (i: number) => void

var d = console.debug.bind(console)

export class RangeGetter {
  static currentRepo = ''
  static commitMessage = ''
  static relativePaths: string[] = []
  static arrayOfToml: TypearrayOfToml
  static codeLenses: CodeLens[]
  static runThrough: (document: TextDocument) => void
  static bindGetRanges(): TypeGetRanges {
    //this can also be used for init :)


    this.arrayOfToml = [
      [this.createCallIfToml(this.createStartsWith('[repo]'), (): void => {
        this.currentRepo = ''
      }), (line: string, whichImIn: [number | null]): void => {
        const currentRepo = validGitRepo(line)
        d('currentRepo', currentRepo)
        if (currentRepo) {
          whichImIn[0] = null
          this.currentRepo = currentRepo
        }
      }],

      [this.createCallIfToml(this.createStartsWith('[commit]'), (i: number): void => {
        this.commitMessage = ''
        d('commit')
        if (this.currentRepo) {
          const range = new Range(i, 0, i + 1, 0)

          const command: Command = {
            title: 'Codelens provided by sample extension',
            command: 'codelens-sample.codelensAction',
            arguments: ['stonks'],
          }

          this.codeLenses.push(new CodeLens(range, command))
        }
      }), (line: string): void => {
        this.commitMessage = `${this.commitMessage}\n${line}`
      }],

      [this.createCallIfToml(this.createStartsWith('[files]'), (): void => {
        this.relativePaths = []
        d('files')
        d(this.commitMessage)
      }), (line: string): void => {
        const fullPath = path.join(this.currentRepo, line)
        if (validFile(fullPath)) {
          this.relativePaths.push(fullPath)
        }
      }],
      // [ this.createCallIfToml(this.createStartsWith('[repo]'),(): void=>{
      // this.currentRepo = ''
      // }), this.repoLineHere.bind(this)],
    ]
    this.runThrough = createRunThrough(this.arrayOfToml, this.createPreprocessorForOther())

    return this.getRanges.bind(this)
  }
  static getRanges(document: TextDocument): CodeLens[] {
    this.codeLenses = []
    this.runThrough(document)
    d(this.relativePaths)
    return this.codeLenses
  }

  static createCallIfToml(ifFunc: TypeStringToBool, callback: TypeNumberToVoid) {
    return (line: string, i: number): boolean => {
      const trueFalse = ifFunc(line)
      if (trueFalse) {
        // if (trueFalse && callback && typeof callback === 'function') {
        callback(i)
      }
      return trueFalse
    }
  }

  static createStartsWith(testStr: string): TypeStringToBool {
    return function(line: string): boolean {
      return line.startsWith(testStr)
    }
  }
  static repoLineHere(line: string, whichImIn: [number | null]): void {
    const currentRepo = validGitRepo(line)
    d('currentRepo', currentRepo)
    if (currentRepo) {
      whichImIn[0] = null
      this.currentRepo = currentRepo
    }
  }





  static createPreprocessorForOther(): CallbackFunctionString {
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