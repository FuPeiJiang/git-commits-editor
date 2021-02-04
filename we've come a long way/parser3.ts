

import { TextDocument, CodeLens, Range, Command } from 'vscode'
import fs = require('fs')
import child_process = require('child_process')
import path = require('path')
import { OkParser } from './OkParser'

type CallbackIfEval = (line: string) => boolean
type CallBackUntilOtherEval = (line: string) => void
// type TypearrayOfToml = [CallbackIfEval,CallBackUntilOtherEval]
type TypearrayOfToml = Array<[CallbackIfEval,CallBackUntilOtherEval]>

type CallbackFunctionString = (line: string) => string
// type TypeRangeGetter = {
// currentRepo: number|null,
// }

// interface TypeRangeGetter {
// arrayOfToml:TypearrayOfToml,
// }

//https://www.typescriptlang.org/docs/handbook/basic-types.html#type-assertions
export const RangeGetter = {
  // export const RangeGetter = <TypeRangeGetter>{
  currentRepo : <null|string>null,
  regExprRepo: new RegExp(String.raw`(?<=^\\*)\\\[repo\]`),
  regExprCommit: new RegExp(String.raw`(?<=^\\*)\\\[commits\]`),
  regExprFiles: new RegExp(String.raw`(?<=^\\*)\\\[files\]`),
  strRepo: String.raw`\[repo]`,
  strCommit: String.raw`\[commits]`,
  strFiles: String.raw`\[files]`,
  preprocessorForOther: function(line: string): string {
    return line.replace(this.regExprRepo, this.strRepo)
      .replace(this.regExprCommit, this.strCommit)
      .replace(this.regExprFiles, this.strFiles)
  },
  createStartsWith: function(testStr: string): CallbackIfEval {
    return function(line: string): boolean {
      return line.startsWith(testStr)
    }
  },
  // arrayOfToml: TypearrayOfToml :[],

  repoLineHere: function(line: string): void {
    const currentRepo = validGitRepo(line)
    if (currentRepo) {
      this.currentRepo = currentRepo
    }
  },
  // arrayOfToml.push()
  // return this.getRanges
  // createStartsWith('[repo]')
  // createStartsWith('[commits]')
  // createStartsWith('[files]')
  okParser:<null|Class>null,
  init: function(): void{
    const arrayOfToml: TypearrayOfToml = []
    arrayOfToml.push([this.createStartsWith('[repo]'), this.repoLineHere])
    // arrayOfToml.push([this.createStartsWith('[commit]'), this.repoLineHere])
    // arrayOfToml.push([this.createStartsWith('[repo]'), this.repoLineHere])
    this.okParser = new OkParser(arrayOfToml, this.preprocessorForOther)

  },

  getRanges: function(document: TextDocument): CodeLens[] {
    return okParser.getRanges
  },
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
