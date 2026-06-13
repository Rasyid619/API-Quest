/** Root routing module. */
import { Router } from 'express'
import health from '../controllers/health.controller'

/** Express router for handling root-level routes. */
const rootRouter = Router()

rootRouter.get('/health', health)

export default rootRouter
