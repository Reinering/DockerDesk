

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
      position: 'bottom'
    }
  },
}
