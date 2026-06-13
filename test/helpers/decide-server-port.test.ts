/** Unit tests for the decideServerPort helper. */
import decideServerPort from '../../src/helpers/decide-server-port'

describe('decideServerPort', () => {
  describe('when PORT is unset', () => {
    it('returns the default port', () => {
      expect(decideServerPort({} as NodeJS.ProcessEnv)).toBe(3000)
    })
  })

  describe('when PORT is a positive integer', () => {
    it('returns the parsed port', () => {
      expect(decideServerPort({ PORT: '8080' } as NodeJS.ProcessEnv)).toBe(8080)
    })
  })

  describe('when PORT is not a positive integer', () => {
    it('throws', () => {
      expect(() => decideServerPort({ PORT: 'abc' } as NodeJS.ProcessEnv)).toThrow('PORT is invalid')
    })
  })
})
