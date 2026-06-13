/** Root routing module. */
import { Router } from 'express'
import authRouter from './auth.route'
import booksRouter from './books.route'
import echo from '../controllers/core/echo.controller'
import health from '../controllers/core/health.controller'
import ping from '../controllers/core/ping.controller'

/** Express router for handling root-level routes. */
const rootRouter = Router()

rootRouter.post('/echo', echo)
rootRouter.get('/health', health)
rootRouter.get('/ping', ping)

rootRouter.use('/auth', authRouter)
rootRouter.use('/books', booksRouter)

export default rootRouter
