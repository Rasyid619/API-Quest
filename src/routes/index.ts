/** Root routing module. */
import BOOK_ID_PARAMS_SCHEMA from '../schemas/book-id-params.schema'
import CREATE_BOOK_SCHEMA from '../schemas/create-book.schema'
import { Router } from 'express'
import createBook from '../controllers/create-book.controller'
import echo from '../controllers/echo.controller'
import getBook from '../controllers/get-book.controller'
import health from '../controllers/health.controller'
import listBooks from '../controllers/list-books.controller'
import ping from '../controllers/ping.controller'
import requestValidator from '../middlewares/request-validator'

/** Express router for handling root-level routes. */
const rootRouter = Router()

rootRouter.post('/echo', echo)
rootRouter.get('/health', health)
rootRouter.get('/ping', ping)

rootRouter.post('/books', requestValidator({ body: CREATE_BOOK_SCHEMA }), createBook)
rootRouter.get('/books', listBooks)
rootRouter.get('/books/:id', requestValidator({ path: BOOK_ID_PARAMS_SCHEMA }), getBook)

export default rootRouter
