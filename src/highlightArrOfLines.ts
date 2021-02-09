var d = console.debug.bind(console)

import { window, Range } from 'vscode'
import type { TextEditorDecorationType } from 'vscode'

function decorationFromColor(color: string): TextEditorDecorationType {
  return window.createTextEditorDecorationType({ backgroundColor: color, isWholeLine:true })
}

const colorsDecoration = <{ [color: string]: TextEditorDecorationType }>{
  red: decorationFromColor('#c94e4e'),
  lime: decorationFromColor('#4ec9b0'),
}

// type ArrOfLines = [string, Range[]][]
type ArrOfLines = {[color: string]: Range[]}
export type { ArrOfLines }

export function highlightArrOfLines(arrOfLines: ArrOfLines): void {

  const activeEditor = window.activeTextEditor
  if (!activeEditor)
  {return}

  for (const [color, ranges] of Object.entries(arrOfLines)) {
    activeEditor.setDecorations(colorsDecoration[color], ranges)
  }

}
