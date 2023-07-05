const config = {
  client: "sqlite3",
  useNullAsDefault: true,
  migrations: { directory: "./data/migrations" },
  seeds: { directory: "./data/seeds" },

  pool: { afterCreate: (conn, done) => conn.run("PRAGMA foreign_keys = ON", done) },
};

module.exports = {
  development: {
    ...config,
    connection: { filename: "./data/database.db3" },
  },
  testing: {
    ...config,
    connection: { filename: "./data/test.db3" },
  },
};
