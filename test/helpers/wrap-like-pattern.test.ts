import wrapLikePattern from '../../src/helpers/wrap-like-pattern'

describe('wrapLikePattern', () => {
  describe('when given a value', () => {
    it('wraps it with LIKE wildcards', () => {
      expect(wrapLikePattern('abc')).toBe('%abc%')
    })
  })
})
