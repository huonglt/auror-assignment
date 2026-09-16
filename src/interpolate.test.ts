import { expect, it, describe } from 'vitest'
import { interpolate } from './interpolate'

describe('interpolate', () => {
  it('should replace a name', () => {
    const result = interpolate('Hello [name]', { name: 'Jim' })
    expect(result).toEqual('Hello Jim')
  })

  it('should keep original string when substituion not available', () => {
    const result = interpolate('Hello [name]', { age: 20 })
    expect(result).toEqual('Hello [name]')
  })

  it('should not replace a value when the brackets are escaped', () => {
    const result = interpolate('Hello [name] [[author]]', { name: 'Jim' })
    expect(result).toEqual('Hello Jim [author]')
  })

  it('should not replace a value when the brackets are escaped even when substituion available', () => {
    const result = interpolate('Hello [name] [[author]]', {
      name: 'Jim',
      author: 'Blue',
    })
    expect(result).toEqual('Hello Jim [author]')
  })

  it('should replace value for 3 brackets', () => {
    const result = interpolate('Hello [[[name]]]', {
      name: 'World',
    })
    expect(result).toEqual('Hello [World]')
  })

  it('should not replace value for 4 brackets', () => {
    const result = interpolate('Hello [[[[name]]]]', {
      name: 'World',
    })
    expect(result).toEqual('Hello [[name]]')
  })

  it('should handle undefined value correctly', () => {
    const result = interpolate('Hello [name]', {
      name: undefined,
    })
    expect(result).toEqual('Hello undefined')
  })

  it('should handle null value correctly', () => {
    const result = interpolate('Hello [name]', {
      name: null,
    })
    expect(result).toEqual('Hello null')
  })

  it('should handle value of object type correctly', () => {
    const result = interpolate('Hello [name]', {
      name: { fullName: 'helen', lastName: 'le' },
    })
    expect(result).toEqual('Hello [object Object]')
  })

  it('should correctly handle malformed delimiter string', () => {
    const result = interpolate('Malformed string ]], [[', {})
    expect(result).toEqual('Malformed string ]], [[')
  })

  it('should correctly handle malformed complex string where more closing delimiter than opening delimiter', () => {
    const result = interpolate(
      'Hello [name], ]], [[, [[[moreClosingThanOpening]]]]]',
      {
        name: 'test',
        moreClosingThanOpening: 3,
      }
    )
    expect(result).toEqual(`Hello test, ]], [[, [3]]`)
  })

  it('should correctly handle malformed complex string where more opening delimiter than closing delimiter', () => {
    const result = interpolate(
      'Hello [name], ]], [[, [[[moreOpeningThanClosing]',
      {
        name: 'test',
        moreOpeningThanClosing: 1,
      }
    )
    expect(result).toEqual(`Hello test, ]], [[, [[1`)
  })

  it('should correctly handle empty single brackets', () => {
    const result = interpolate('Hello []', { name: 'World' })
    expect(result).toEqual('Hello []')
  })

  it('should correctly handle empty double brackets', () => {
    const result = interpolate('Hello [[]]', { name: 'World' })
    expect(result).toEqual('Hello []')
  })

  it('should correctly handle empty tripple brackets', () => {
    const result = interpolate('Hello [[[]]]', { name: 'World' })
    expect(result).toEqual('Hello [[]]')
  })
})
