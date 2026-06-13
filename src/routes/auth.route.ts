/** Auth routing module. */
import LOGIN_SCHEMA from '../schemas/login.schema'
import { Router } from 'express'
import login from '../controllers/auth.controller'
import requestValidator from '../middlewares/request-validator'

/** Express router for the auth resource. */
const authRouter = Router()

authRouter.post('/token', requestValidator({ body: LOGIN_SCHEMA }), login)

export default authRouter
