import log from 'electron-log'
import path from 'path'
import { fileURLToPath } from 'node:url'
import { clientConfig } from 'src/common/config.js'



const logPath = path.resolve(fileURLToPath(new URL('.', import.meta.url)), clientConfig.logging.logPath)


export function initLogging() {
  log.initialize()

  log.transports.file.resolvePathFn = () => path.join(logPath, clientConfig.logging.logFile)

  log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}]{scope} {text}'
  log.transports.file.maxSize = 10485760
  log.transports.file.level = 'debug'
  // log.transports.console.level = 'false'
}
