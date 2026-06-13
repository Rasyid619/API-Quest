/** Synchronous Express middleware type. */
import type { NextFunction, Request, Response } from 'express'

/** Synchronous middleware that either calls next or writes a response. */
type SyncMiddleware = (request: Request, response: Response, next: NextFunction) => void

export default SyncMiddleware
