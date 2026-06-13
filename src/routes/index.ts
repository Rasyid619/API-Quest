/** Root routing module. */
import { Router } from 'express'
import echo from '../controllers/echo.controller'
import health from '../controllers/health.controller'

/** Express router for handling root-level routes. */
const rootRouter = Router()

rootRouter.post('/echo', echo)
rootRouter.get('/health', health)

export default rootRouter
