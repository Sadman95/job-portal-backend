import { Server } from 'http'
import mongoose from 'mongoose'
import app from './app'
import config from './config'
import { logger } from './shared/logger'
import socket from './lib/socket'

//handle Uncaught exceptions
process.on('uncaughtException', error => {
  logger.error(error)
  // console.error(error)
  process.exit(1)
})

let server: Server

async function bootsrap() {
  const db_uri = config.db.uri
  try {
    await mongoose.connect(db_uri as string, { dbName: config.db.name })
    // logger.info(`DATABASE CONNECTION SUCCESSFUL`)
    console.log(`DATABASE CONNECTION SUCCESSFUL`)
    server = app.listen(config.port, () => {
      // logger.info(
      //   `App server listening on port ${config.port}`
      // )
      console.log(`App server listening on port ${config.port}`)
    })
    socket(server)
  } catch (e) {
    logger.error(e)
    console.error(e)
  }

  //handle Unhandledrejection: Gracefully off the server
  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        // logger.error(error)
        console.error(error)
        process.exit(1)
      })
    } else {
      process.exit(1)
    }
  })
}

bootsrap()

//SIGTERM detection
process.on('SIGTERM', () => {
  // logger.info('SIGTERM is received')
  console.log('SIGTERM is received')
  if (server) {
    server.close()
  }
})
