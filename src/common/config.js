
const dev = true

export const clientConfig = {
  lang: 'en',

  sqlite: {
    dbPath: 'data',
    dbName: 'docker.db',
    dbVersion: '1.0',
    dbDescription: 'SQLite Database for Client',
    dbSize: 10 * 1024 * 1024, // 2MB
  },

  quasar: {
    notify: {
      position: 'bottom'     // left | right | top | bottom | center | top-left | top-right | bottom-left | bottom-right
    }
  },

  encryption: {
    key: 'igkIqttVLvw2NTPD1Uq2hMOmxCodDl3E',
    iv: 'EqzoTlqyyf',
    interference: ';' * 100
  },

  file: {
    limitSize: 1048576,
  },

  logging: {
    logPath: 'logs',
    logFile: 'logging.log',
    level: 'info',      // error, warn, info, verbose, debug, silly
  }
}


export const devConsole = (...datas) => {
  if (dev === true) {
    console.log(datas)
  }
}

