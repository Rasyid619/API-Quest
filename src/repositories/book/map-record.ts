import type Book from '../../types/entities/book'
import type BookRecord from '../../types/query-results/book/book.record'

/**
 * Maps a raw books row to a Book entity.
 *
 * @param record - Raw books table row.
 * @returns Book entity.
 */
const mapBookRecord = (record: BookRecord): Book => ({
  id: record.id,
  title: record.title,
  author: record.author,
  year: record.year,
})

export default mapBookRecord
