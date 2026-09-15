import { expect, it, describe } from 'vitest'
import { interpolate } from './interpolate'

describe('interpolate', () => {
  it('should replace a name', () => {
    const result = interpolate('Hello [name]', { name: 'Jim' })
    expect(result).toEqual('Hello Jim')
  })

  it('should not replace a value when the brackets are escaped', () => {
    const result = interpolate('Hello [name] [[author]]', { name: 'Jim' })
    expect(result).toEqual('Hello Jim [author]')
  })
})
