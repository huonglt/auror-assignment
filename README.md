# Node + TypeScript + Vitest

This is the solution for Auror Algorithm Assessment
This is NodeJS app using Typescript with Vitest
To run test, type npm run test on the terminal

### Note:

Why I used String(value) for string substitution:

- The dictionary values can be of any type: from primitive, to complex object etc
- To get the readable form for any type of value can be quite complex & tricky
- The requirement doesn't specify if the substitution must be in readable form
- So I use String(value) to get the string representation of the substitution value
- String(value) is safest and most reliable way to get a string representation of any value
- String(value) works well with primitive types, undefined, null, NaN, function, Symbol, Array (of primitive)
- For plain JS object, the substituion will be [object Object]
- This conforms to string interpolation with template literal
