/** Root routing module. */
import { Router } from 'express'
import health from '../controllers/health.controller'
import ping from '../controllers/ping.controller'

/** Express router for handling root-level routes. */
const rootRouter = Router()

rootRouter.get('/health', health)
rootRouter.get('/ping', ping)

export default rootRouter
