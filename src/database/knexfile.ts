import path from "path";
import config from "../config"

const dbConfiguration = {
  client: "mysql2",
  connection: {
    host: config.db.host!,
    port: config.db.port!,
    user: config.db.user!, 
    password: config.db.password, 
    database: config.db.database
  },
  pool: { min: 0, max: 10 },
  migrations: {
    directory: path.join(__dirname, "migrations"),
  },
  seeds: {
    directory: path.join(__dirname ,  'seed')
  }
}; 

Object.freeze(dbConfiguration)

export default dbConfiguration;