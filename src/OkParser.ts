import { TextDocument } from 'vscode'
type CallbackIfEval = (line: string) => boolean
type CallBackUntilOtherEval = (line: string) => void
type TypearrayOfToml = Array<[CallbackIfEval,CallBackUntilOtherEval]>

type CallbackFunctionString = (line: string) => string

export class OkParser {
  arrayOfToml: TypearrayOfToml
  preprocessorForOther: CallbackFunctionString
  whichImIn: number|null=null

  constructor(arrayOfToml: TypearrayOfToml, preprocessorForOther: CallbackFunctionString) {
    this.arrayOfToml = arrayOfToml
    this.preprocessorForOther = preprocessorForOther
  }

  getRanges(document: TextDocument): void {
    const text = document.getText()
    //   let matches
    const arr: string[] = text.split('\n')

    loopLines:
    for (let i = 0, len = arr.length; i < len; i++) {
      const line = arr[i]

      for (let n = 0, len = this.arrayOfToml.length; n < len; n++) {
        const [callbackIfEval] = this.arrayOfToml[n]
        if (callbackIfEval(line)) {
          this.whichImIn = n
          continue loopLines
        }
      }
      //continue was not called: so other
      if (this.whichImIn !== null) {
        const callBackUntilOtherEval = this.arrayOfToml[1]
        callBackUntilOtherEval[this.whichImIn](line)
      }
    }
    return this.ReturnThis()
  }

}




