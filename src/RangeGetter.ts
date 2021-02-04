

import { TextDocument, CodeLens, Range, Command } from 'vscode'
import fs = require('fs')
import child_process = require('child_process')
import path = require('path')
import createRunThrough from './createRunThrough'

type CallbackIfEval = (line: string) => boolean
type CallBackUntilOtherEval = (line: string) => void

type TypearrayOfToml = Array<[CallbackIfEval, CallBackUntilOtherEval]>

type CallbackFunctionString = (line: string) => string

type TypeGetRanges = (document: TextDocument) => CodeLens[]

var d = console.debug.bind(console)

class RangeGetter {
  currentRepo=''
  arrayOfToml: TypearrayOfToml = [
    [this.createStartsWith('[repo]'), this.repoLineHere],
  ]
   runThrough=createRunThrough(this.arrayOfToml,this.createPreprocessorForOther())

   createStartsWith(testStr: string): CallbackIfEval {

     return function(line: string): boolean {
       return line.startsWith(testStr)
     }
   }
   repoLineHere(line: string): void {
     const currentRepo = validGitRepo(line)
     d('currentRepo', currentRepo)
     if (currentRepo) {
       this.currentRepo = currentRepo
     }
   }

   bindGetRanges(): TypeGetRanges{
     return this.getRanges.bind(this)
   }

   getRanges(document: TextDocument): CodeLens[] {
     this.runThrough(document)
     return []
   }

   createPreprocessorForOther(): CallbackFunctionString {
     const regExprRepo = new RegExp(String.raw`(?<=^\\*)\\\[repo\]`)
     const regExprCommit = new RegExp(String.raw`(?<=^\\*)\\\[commits\]`)
     const regExprFiles = new RegExp(String.raw`(?<=^\\*)\\\[files\]`)
     const strRepo = String.raw`\[repo]`
     const strCommit = String.raw`\[commits]`
     const strFiles = String.raw`\[files]`
     return function(line: string): string {
       return line.replace(regExprRepo, strRepo)
         .replace(regExprCommit, strCommit)
         .replace(regExprFiles, strFiles)
     }
   }


}
export { RangeGetter }


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