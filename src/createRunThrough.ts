import { TextDocument } from 'vscode'
type CallbackIfEval = (line: string, i: number) => boolean
type CallBackUntilOtherEval = (line: string, whichImIn: [number|null]) => void
export type { CallbackIfEval, CallBackUntilOtherEval }
type TypearrayOfToml = Array<[CallbackIfEval,CallBackUntilOtherEval]>

type CallbackFunctionString = (line: string) => string
var d = console.debug.bind(console)

// type TypeStringToVoid = (line: string) => void
export default (arrayOfToml: TypearrayOfToml, preprocessorForOther: CallbackFunctionString) => {

  return (document: TextDocument): void => {
    const whichImIn: [number|null] = [null]
    const text = document.getText()
    //   let matches
    const arr: string[] = text.split('\n')

    loopLines:
    for (let i = 0, len = arr.length; i < len; i++) {
      const line = arr[i]

      for (let n = 0, len = arrayOfToml.length; n < len; n++) {
        const [callbackIfEval] = arrayOfToml[n]
        if (callbackIfEval(line, i)) { //first callback
          whichImIn[0] = n
          continue loopLines
        }
      }
      //continue was not called: so other
      if (whichImIn[0] !== null) {
        const callBackUntilOtherEval = arrayOfToml[whichImIn[0]][1]
        const processedLine = preprocessorForOther(line)
        callBackUntilOtherEval(processedLine, whichImIn) //second callback
      }
    }
  }

}




