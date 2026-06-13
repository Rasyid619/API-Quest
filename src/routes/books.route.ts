/** Books routing module. */
import BOOK_ID_PARAMS_SCHEMA from '../schemas/book-id-params.schema'
import CREATE_BOOK_SCHEMA from '../schemas/create-book.schema'
import LIST_BOOKS_QUERY_SCHEMA from '../schemas/list-books-query.schema'
import { Router } from 'express'
import createBook from '../controllers/create-book.controller'
import deleteBook from '../controllers/delete-book.controller'
import getBook from '../controllers/get-book.controller'
import listBooks from '../controllers/list-books.controller'
import requestValidator from '../middlewares/request-validator'
import updateBook from '../controllers/update-book.controller'
import verifyToken from '../middlewares/verify-token'

/** Express router for the books resource. */
const booksRouter = Router()

booksRouter.post('/', requestValidator({ body: CREATE_BOOK_SCHEMA }), createBook)
booksRouter.get('/', verifyToken(), requestValidator({ query: LIST_BOOKS_QUERY_SCHEMA }), listBooks)
booksRouter.get('/:id', requestValidator({ path: BOOK_ID_PARAMS_SCHEMA }), getBook)
booksRouter.put('/:id', requestValidator({ path: BOOK_ID_PARAMS_SCHEMA, body: CREATE_BOOK_SCHEMA }), updateBook)
booksRouter.delete('/:id', requestValidator({ path: BOOK_ID_PARAMS_SCHEMA }), deleteBook)

export default booksRouter
