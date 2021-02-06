import { languages, commands, Disposable, workspace } from 'vscode'
import { CodelensProvider } from './CodelensProvider'
import { createRangeGetter } from './createRangeGetter'
var d = console.debug.bind(console)
let disposables: Disposable[] = []

export function activate(): void {
  // export function activate(context: ExtensionContext) {

  /*   const ok = new Bar()
  console.log(ok)
  const startsWith = ok.createStartsWith('greh')
  console.debug(startsWith) //null, this is a function
  console.debug(startsWith) //null, this is a function
  console.log(startsWith) //null, this is a function
  // console.log(startsWith) //null, this is a function
  console.log(startsWith('greh gttrh')) //null, this is a function
  console.log(startsWith('g4576h fefef')) //null, this is a function */


  // const rangeGetter = new RangeGetter()
  // const startsWith = rangeGetter.createStartsWith('egeg')
  // console.debug('startsWith', startsWith)
  // console.debug(startsWith('egeg erh'))
  // console.debug(startsWith('egg6 erh'))
  // console.debug('debugOk', startsWith)
  // return

  const codelensProvider = new CodelensProvider(createRangeGetter())
  // const codelensProvider = new CodelensProvider(RangeGetter.bindGetRanges())
  // const codelensProvider = new CodelensProvider(rangeGetter.getRanges.bind(rangeGetter))
  languages.registerCodeLensProvider({scheme: 'file', language: 'commits' }, codelensProvider)

  commands.registerCommand('codelens-sample.enableCodeLens', () => {
    workspace.getConfiguration('codelens-sample').update('enableCodeLens', true, true)
  })

  commands.registerCommand('codelens-sample.disableCodeLens', () => {
    workspace.getConfiguration('codelens-sample').update('enableCodeLens', false, true)
  })

  commands.registerCommand('codelens-sample.stage', (fullPaths: string[]) => {
    d(fullPaths)
  })

  commands.registerCommand('codelens-sample.commit', (commitMessage: string) => {
    d(commitMessage)
  })
}

// this method is called when your extension is deactivated
export function deactivate(): void {
  if (disposables) {
    disposables.forEach(item => item.dispose())
  }
  disposables = []
}