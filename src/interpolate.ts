/**
 * string interpolation using [] as delimited tokens
 * treat double brackets as an escape sequence, in case the user wants to include brackets in the output string.
 */
export function interpolate(input: string, dictValues: Record<string, any>) {
  // handle the [name] pattern
  const regExp = /\[(.+)\]/g
  return input.replace(regExp, (match: string, ...args: any[]) => {
    console.log(`matched = ${match}`)
    console.log(JSON.stringify(args))
    console.log(`args[0] = ${args[0]}`)
    // replace the [name] with dictValues[name]
    const key = args[0]
    if (dictValues[key]) {
      // substitute with the value from the dict
      return String(dictValues[key])
    }
    // no substitution, keep the original string
    return match
  })
}
