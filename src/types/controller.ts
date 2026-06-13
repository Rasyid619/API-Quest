/** Async Express handler type for a single endpoint. */
import type { NextFunction, Request, Response } from 'express'

/** Async controller handling one endpoint; Express 5 forwards rejections to the error handler. */
type Controller = (request: Request, response: Response, next: NextFunction) => Promise<void>

export default Controller
