/** Unit tests for the checkEnvVars helper. */
import checkEnvVars from '../../src/helpers/check-env-vars'

describe('checkEnvVars', () => {
  describe('when all required variables are present', () => {
    it('does not exit the process', () => {
      const exit = jest.spyOn(process, 'exit').mockImplementation((() => undefined) as never)

      checkEnvVars({ A: '1', B: '2' } as NodeJS.ProcessEnv, ['A', 'B'])

      expect(exit).not.toHaveBeenCalled()
      exit.mockRestore()
    })
  })

  describe('when a required variable is missing', () => {
    it('logs the missing names and exits with code 1', () => {
      const exit = jest.spyOn(process, 'exit').mockImplementation((() => undefined) as never)
      const error = jest.spyOn(console, 'error').mockImplementation(() => undefined)

      checkEnvVars({ A: '1' } as NodeJS.ProcessEnv, ['A', 'B'])

      expect(error).toHaveBeenCalledWith(expect.stringContaining('B'))
      expect(exit).toHaveBeenCalledWith(1)
      exit.mockRestore()
      error.mockRestore()
    })
  })
})
