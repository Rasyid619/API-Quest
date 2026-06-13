import * as bookRepository from '../../../src/repositories/book'
import createBook from '../../../src/services/book/create.service'

describe('createBook', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('when the payload is valid', () => {
    it('creates a book with a generated id and inserts it once', async () => {
      const payload = { title: 'Sapiens', author: 'Harari', year: 2011 }
      const stored = { id: 'book-id', ...payload }
      const insertBook = jest.spyOn(bookRepository, 'insertBook').mockResolvedValue(stored)

      const created = await createBook(payload)

      expect(created).toEqual(stored)
      expect(insertBook).toHaveBeenCalledTimes(1)
      expect(insertBook).toHaveBeenCalledWith({
        id: expect.any(String),
        title: payload.title,
        author: payload.author,
        year: payload.year,
      })
    })
  })
})
