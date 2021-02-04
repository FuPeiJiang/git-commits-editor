

import { TextDocument, CodeLens, Range, Command } from 'vscode'
import fs = require('fs')
import child_process = require('child_process')
import path = require('path')
// import { OkParser } from './OkParser'
import createRunThrough from './createRunThrough'
// import * as createRunThrough from './createRunThrough'

type CallbackIfEval = (line: string) => boolean
type CallBackUntilOtherEval = (line: string) => void
// type TypearrayOfToml = [CallbackIfEval,CallBackUntilOtherEval]
type TypearrayOfToml = Array<[CallbackIfEval, CallBackUntilOtherEval]>

type CallbackFunctionString = (line: string) => string

type TypeGetRanges = (document: TextDocument) => CodeLens[]
// type TypeRangeGetter = {
// currentRepo: number|null,
// }

// interface TypeRangeGetter {
// arrayOfToml:TypearrayOfToml,
// }
var d = console.debug.bind(console)

//https://www.typescriptlang.org/docs/handbook/basic-types.html#type-assertions
class RangeGetter {
  // runThrough: (document: TextDocument) => void
  // currentRepo=this.createStartsWith('string')
  currentRepo=''
  arrayOfToml: TypearrayOfToml = [
    [this.createStartsWith('[repo]'), this.repoLineHere],
  ]
  // okParser: OkParser = new OkParser(this.arrayOfToml,this.createPreprocessorForOther())
  // runThrough: (document: TextDocument) => void
  //  =new OkParser(this.arrayOfToml,this.createPreprocessorForOther()).runThrough
  //  runThrough=new OkParser(this.arrayOfToml,this.createPreprocessorForOther()).runThrough
  //  runThrough=this.okParser.runThrough.bind(this.okParser)

   runThrough=createRunThrough(this.arrayOfToml,this.createPreprocessorForOther())

   // static _staticConstructorDummyResult = (() => {
   // console.log('static constructor called') // once!
   // const arrayOfToml: TypearrayOfToml = []
   // arrayOfToml.push([this.createStartsWith('[repo]'), this.repoLineHere])
   // d(arrayOfToml)
   // })()

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
     //  var that = this
     //  return function() {
     //  console.log(that.valueOf())
     //  }
   }

   getRanges(document: TextDocument): CodeLens[] {
     // return okParser.getRanges
     //  d(document)
     //  d('ok please', this.this) //illegal
     //  d('ok please', this)
     //  d('ok please', this.runThrough)
     this.runThrough(document)
     // this.okParser.runThrough(document)
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

  // arrayOfToml: TypearrayOfToml :[],



}
export { RangeGetter }


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