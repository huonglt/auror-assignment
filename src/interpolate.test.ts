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

  it('should not replace a value when the brackets are escaped', () => {
    const result = interpolate('Hello [name] [[author]]', {
      name: 'Jim',
      author: 'Blue',
    })
    expect(result).toEqual('Hello Jim [author]')
  })

  it('should replace value for 3 brackets', () => {
    const result = interpolate('Hello [[[name]]]', {
      name: 'Chocolate',
    })
    expect(result).toEqual('Hello [Chocolate]')
  })

  it('should not replace value for 4 brackets', () => {
    const result = interpolate('Hello [[[[name]]]]', {
      name: 'Chocolate',
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
})
