/**
 * create the RegExp for the string interpolation
 * The regExp will match pattern of [[, or ]], or [key]
 */
const createRegExp = () => {
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
 * function for string interpolation using [] as delimited tokens
 * treat double brackets as an escape sequence, in case user wants to include brackets in the output string
 * @param input: the input string
 * @param dictValues: dictionary of values for string substitution
 */
export function interpolate(input: string, dictValues: Record<string, any>) {
  const regExp = createRegExp()

  // replace all matches of [[ or ]] or [key] in the input via a replacer function
  return input.replace(regExp, (match: string, key: string) => {
    if (match === '[[') {
      // escape the double opening bracket [[ with [
      return '['
    } else if (match === ']]') {
      // escape the double closing bracket ]] with ]
      return ']'
    } else {
      /**
       * matching the [key] pattern here
       * substitute the [key] with dictValues[key] if exist. If not, keep the original match
       */
      if (key in dictValues) {
        return String(dictValues[key])
      }

      return match
    }
  })
}
