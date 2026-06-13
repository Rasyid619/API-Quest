import express, { type Express } from 'express'
import bodyParserErrorHandler from './middlewares/body-parser-error-handler'
import compression from 'compression'
import cors from 'cors'
import errorHandler from './middlewares/error-handler'
import morgan from 'morgan'
import rootRouter from './routes'

/** Format string for the Morgan logger. */
const MORGAN_FORMAT = ':remote-addr - ":method :url" :status :res[content-length] ":user-agent"'

/**
 * Builds the Express application instance.
 *
 * @param attachLogger - Whether to attach the Morgan logger.
 * @returns Configured Express application.
 */
const buildApp = (attachLogger: boolean): Express => {
  /** Express application instance. */
  const app = express()

  app.disable('x-powered-by')
  app.set('query parser', 'extended') // Enables `qs` for query parsing
  app.use(cors())

  /* istanbul ignore if */
  if (attachLogger) {
    app.use(morgan(MORGAN_FORMAT))
  }

  app.use(compression())
  app.use(express.json())
  app.use(bodyParserErrorHandler)

  app.use('/', rootRouter)

  app.use(errorHandler)

  return app
}

export default buildApp
