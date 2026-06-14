/** Unit tests for getting books. */
import * as findBookByIdModule from '../../../src/repositories/book/find-by-id'
import NotFoundError from '../../../src/errors/not-found-error'
import getBook from '../../../src/services/book/get.service'

describe('getBook', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('when the book exists', () => {
    it('returns the book and calls the repository once', async () => {
      const book = { id: 'book-id', title: '1984', author: 'Orwell', year: 1949 }
      const findBookById = jest.spyOn(findBookByIdModule, 'default').mockResolvedValue(book)

      const result = await getBook(book.id)

      expect(result).toEqual(book)
      expect(findBookById).toHaveBeenCalledTimes(1)
      expect(findBookById).toHaveBeenCalledWith(book.id)
    })
  })

  describe('when the book is missing', () => {
    it('throws NotFoundError and calls the repository once', async () => {
      const findBookById = jest.spyOn(findBookByIdModule, 'default').mockResolvedValue(undefined)

      await expect(getBook('missing-id')).rejects.toThrow(NotFoundError)
      expect(findBookById).toHaveBeenCalledTimes(1)
      expect(findBookById).toHaveBeenCalledWith('missing-id')
    })
  })
})
