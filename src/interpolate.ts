/**
 * create the RegExp for the delimiter string
 * The regExp will match pattern of [[, or ]], or [key]
 */
const createRegExpForDelimiterString = () => {
  // matching [[ string
  const regDoubleOpeningBracket = /\[\[/

  // matching ]] string
  const regDoubleClosingBracket = /\]\]/

  // matching string pattern [key]
  const regSingleBracketWithKey = /\[([^\[\]]+)\]/

  // the combined reg of: /\[\[|\]\]|\[([^\[\]]+)\]/g
  // matching pattern [[ or ]] or [key]
  const combinedRegStr = [
    regDoubleOpeningBracket,
    regDoubleClosingBracket,
    regSingleBracketWithKey,
  ]
    .map((ex) => ex.source)
    .join('|')

  return new RegExp(combinedRegStr, 'g')
}

/**
 * create the RegExp for string interpolation
 * The regExp will match pattern of [key], [[key]], [[[key]]], [[[[[key]]]]]]]]
 */
const createRegExp = () => {
  // for pattern [key]
  const regSinglePairDelimiter = /\[([^\[\]]+)\]/

  // for pattern with multiple opening delimiter and closing delimiter [[key]] or [[[key]]], or [[[[[key]]]]]]]
  const regMultiPairDelimiter = /\[{1,}(\[([^\[\]]+)\])\]{1,}/

  // for pattern [[]] without key
  const regEmptyDoublePairDelimiter = /\[\[\]\]/
  // the combined reg of: /\[([^\[\]]+)\]|\[\[\]\]|\[{1,}(?\[([^\[\]]+)\])\]{1,}/g
  // matching pattern [key], [[key]], [[[key]]], or unequal opening / closing delimiter [[[key]]]]]]
  const combinedRegStr = [
    regSinglePairDelimiter,
    regEmptyDoublePairDelimiter,
    regMultiPairDelimiter,
  ]
    .map((ex) => ex.source)
    .join('|')

  return new RegExp(combinedRegStr, 'g')
}

/**
 * function for string interpolation using [] as delimited tokens
 * treat double brackets as an escape sequence, in case user wants to include brackets in the output string
 * @param input: the input string iin delimiter pattern: [key], or [[key]], or [[[[key]]]]
 * @param dictValues: dictionary of values for string substitution
 */
function interpolateDelimiterString(
  input: string,
  dictValues: Record<string, any>
) {
  const regExp = createRegExpForDelimiterString()

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
       * value of dictValues[key] can be of any type: primitive, function, array, object, object with nested object etc
       * for simplicity, get the string representation of the value via String function
       */
      if (key in dictValues) {
        return String(dictValues[key])
      }

      return match
    }
  })
}

/**
 * function for string interpolation using [] as delimited tokens
 * treat double brackets as an escape sequence, in case user wants to include brackets in the output string
 * @param input: the input string
 * @param dictValues: dictionary of values for string substitution
 */
export function interpolate(input: string, dictValues: Record<string, any>) {
  const regExp = createRegExp()

  // replace all matches of [key], [[key]] or [[[[key]]]]]] in the input via a replacer function
  return input.replace(regExp, (match: string) => {
    // for each match: interpolate via delimiter string to correctly handle extra opening delimiter or closing delimiter
    return interpolateDelimiterString(match, dictValues)
  })
}
