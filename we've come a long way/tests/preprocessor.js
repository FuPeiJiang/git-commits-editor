function createPreprocessorForOther() {
  const regExprRepo = new RegExp(String.raw`(?<=^\\*)\\\[repo\]`)
  const regExprCommit = new RegExp(String.raw`(?<=^\\*)\\\[commit\]`)
  const regExprFiles = new RegExp(String.raw`(?<=^\\*)\\\[files\]`)
  const strRepo = String.raw`[repo]`
  const strCommit = String.raw`[commit]`
  const strFiles = String.raw`[files]`
  return function(line) {
    return line.replace(regExprRepo, strRepo)
      .replace(regExprCommit, strCommit)
      .replace(regExprFiles, strFiles)
  }
}

const ok = createPreprocessorForOther()
console.log(ok(String.raw`\[commit]`))