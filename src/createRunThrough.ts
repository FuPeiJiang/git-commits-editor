import { TextDocument } from 'vscode'
type CallbackIfEval = (line: string) => boolean
type CallBackUntilOtherEval = (line: string) => void
type TypearrayOfToml = Array<[CallbackIfEval,CallBackUntilOtherEval]>

type CallbackFunctionString = (line: string) => string
var d = console.debug.bind(console)

export default (arrayOfToml: TypearrayOfToml, preprocessorForOther: CallbackFunctionString) => {

  return (document: TextDocument): void => {
    let whichImIn: number|null = null
    const text = document.getText()
    //   let matches
    const arr: string[] = text.split('\n')

    loopLines:
    for (let i = 0, len = arr.length; i < len; i++) {
      const line = arr[i]

      for (let n = 0, len = arrayOfToml.length; n < len; n++) {
        const [callbackIfEval] = arrayOfToml[n]
        if (callbackIfEval(line)) {
          whichImIn = n
          continue loopLines
        }
      }
      //continue was not called: so other
      if (whichImIn !== null) {
        const callBackUntilOtherEval = arrayOfToml[whichImIn][1]
        const processedLine = preprocessorForOther(line)
        callBackUntilOtherEval(processedLine)
      }
    }
  }

}




