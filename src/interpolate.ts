/**
 * Create the RegExp to match pattern of [[, or ]], or [key]
 * This RexExp will perform on the string already in delimiter pattern which is: [key], [[key]], [[[key]]]]]
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
 * Create the RegExp for string interpolation
 * The RegExp will match pattern of [key], [[key]], [[[key]]], [[[[[key]]]]]]]]
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
 * Function for string interpolation using [] as delimited tokens
 * Treat double brackets as an escape sequence, in case user wants to include brackets in the output string
 * @param {string} input: the input string already in delimiter pattern: [key], or [[key]], or [[[[key]]]]
 * @param {Record<string, any>} dictValues: dictionary of values for string substitution
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
 * Function for string interpolation using [] as delimited tokens
 * Treat double brackets as an escape sequence, in case user wants to include brackets in the output string
 * @param {string} input: the string to interpolate
 * @param {Record<string, any>} dictValues: dictionary of values for string substitution
 */
export function interpolate(input: string, dictValues: Record<string, any>) {
  const regExp = createRegExp()

  // replace all matches of [key], [[key]] or [[[[key]]]]]] in the input via a replacer function
  return input.replace(regExp, (match: string) => {
    // for each match: interpolate via delimiter string to correctly handle extra opening delimiter or closing delimiter
    return interpolateDelimiterString(match, dictValues)
  })
}
