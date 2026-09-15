/**
 * create the RegExp for the string interpolation
 */
const createRegEx = () => {
  // matching [[ string
  const regDoubleOpeningBracket = /\[\[/

  // matching ]] string
  const regDoubleClosingBracket = /\]\]/

  // matching string pattern [key]
  const regSingleBracketWithKey = /\[([^\[\]]+)\]/

  // matching pattern either [[ or ]] or [key]
  const combinedRegStr = [
    regDoubleClosingBracket,
    regDoubleOpeningBracket,
    regSingleBracketWithKey,
  ]
    .map((ex) => ex.source)
    .join('|')

  return new RegExp(combinedRegStr, 'g')
}

/**
 * string interpolation using [] as delimited tokens
 * treat double brackets as an escape sequence, in case the user wants to include brackets in the output string.
 */
export function interpolate(input: string, dictValues: Record<string, any>) {
  const regExp = createRegEx()
  return input.replace(regExp, (matched: string, key: string) => {
    if (matched === '[[') {
      return '['
    } else if (matched === ']]') {
      return ']'
    } else {
      // substitute the [match] with dictValues[key]
      if (dictValues[key]) {
        return String(dictValues[key])
      }
      // no substitution, keep the original string
      return matched
    }
  })
}
