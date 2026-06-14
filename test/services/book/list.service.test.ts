/** Unit tests for listing books. */
import * as findBooksModule from '../../../src/repositories/book/find'
import listBooks from '../../../src/services/book/list.service'

describe('listBooks', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('when page and limit are provided', () => {
    it('calls the repository once with the computed offset', async () => {
      const books = [{ id: 'book-id', title: 'Sapiens', author: 'Harari', year: 2011 }]
      const findBooks = jest.spyOn(findBooksModule, 'default').mockResolvedValue(books)

      const result = await listBooks({ page: 2, limit: 10 })

      expect(result).toEqual(books)
      expect(findBooks).toHaveBeenCalledTimes(1)
      expect(findBooks).toHaveBeenCalledWith({ author: undefined, limit: 10, offset: 10 })
    })
  })

  describe('when an author filter is provided', () => {
    it('passes the author filter to the repository once', async () => {
      const books = [{ id: 'book-id', title: 'Sapiens', author: 'Harari', year: 2011 }]
      const findBooks = jest.spyOn(findBooksModule, 'default').mockResolvedValue(books)

      const result = await listBooks({ author: 'harari', page: 1, limit: 10 })

      expect(result).toEqual(books)
      expect(findBooks).toHaveBeenCalledTimes(1)
      expect(findBooks).toHaveBeenCalledWith({ author: 'harari', limit: 10, offset: 0 })
    })
  })
})
