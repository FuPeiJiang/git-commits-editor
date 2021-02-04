

import { TextDocument, CodeLens, Range, Command } from 'vscode'
import fs = require('fs')
import child_process = require('child_process')
import path = require('path')
import { OkParser } from './okParser'
// const regexAndStr = {
// repo: {regex: new RegExp(String.raw`\\\[repo\]`, 'g'), str:'[repo]'},
// commit: {regex: new RegExp(String.raw`\\\[commit\]`, 'g'), str:'[commit]'},
// files: {regex: new RegExp(String.raw`\\\[files\\]`, 'g'), str:'[files]'},
// }

// const regExprRepo = new RegExp(String.raw`\\\[repo\]`, 'g')
// const regExprCommit = new RegExp(String.raw`\\\[commit\]`, 'g')
// const regExprFiles = new RegExp(String.raw`\\\[files\]`, 'g')
// const strRepo = '[repo]'
// const strCommit = '[commit]'
// const strFiles = '[files]'



export const RangeGetter = {

// const RangeGetter:any = {
  // export function getRanges(document: TextDocument): CodeLens[] {

  constructor() {
    // new OkParser()
    // push(ifEval, UntilOtherEval)

    const regExprRepo = new RegExp(String.raw`(?<=^\\*)\\\[repo\]`)
    const regExprCommit = new RegExp(String.raw`(?<=^\\*)\\\[commits\]`)
    const regExprFiles = new RegExp(String.raw`(?<=^\\*)\\\[files\]`)
    const strRepo = String.raw`\[repo]`
    const strCommit = String.raw`\[commits]`
    const strFiles = String.raw`\[files]`
    const preprocessorForOther = function(line: string): string {
      return line.replace(regExprRepo, strRepo).replace(regExprCommit, strCommit).replace(regExprFiles, strFiles)
    }

    type CallbackIfEval = (line: string) => boolean
    const createStartsWith = function(testStr: string): CallbackIfEval {
      return startsWith = function(line: string): boolean {
        return line.startsWith(testStr)
      }
    }
    type CallBackUntilOtherEval = (line: string) => void
    type TypearrayOfToml = Array<[CallbackIfEval, CallBackUntilOtherEval]>
    const arrayOfToml: TypearrayOfToml = []

    const repoLineHere = function(line: string): void {
      const currentRepo = validGitRepo(line)
      if (currentRepo) {
        this.currentRepo = currentRepo
      }
    }
    arrayOfToml.push()
    // return this.getRanges
    arrayOfToml.push(createStartsWith('[repo]'),repoLineHere)
    // createStartsWith('[repo]')
    // createStartsWith('[commits]')
    // createStartsWith('[files]')


  }
  getRanges(document: TextDocument): CodeLens[] {

  }
}


// type CallbackIfEval = (line: string) => boolean
// type TypearrayOfToml = Array<[CallbackIfEval,CallBackUntilOtherEval]>
//
// type CallbackFunctionString = (line: string) => string


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
