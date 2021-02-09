import { CodeLensProvider, TextDocument, CodeLens, workspace } from 'vscode'

type FuncAnyReturnCodeLensArr = (...args: any[]) => CodeLens[]
export type { FuncAnyReturnCodeLensArr }

export class CodelensProvider implements CodeLensProvider {
  getRanges: FuncAnyReturnCodeLensArr

  constructor(getRanges: FuncAnyReturnCodeLensArr) {
    this.getRanges = getRanges
  }

  public provideCodeLenses(document: TextDocument): CodeLens[] {

    if (workspace.getConfiguration('codelens-sample').get('enableCodeLens', true)) {
      return this.getRanges(document)
    }
    return []
  }

}