import dbConfiguration from "./knexfile";
import {knex} from 'knex'

class DBConnection {
  private static instance: DBConnection;
  private db;
  
  private constructor() {
    this.db = knex(dbConfiguration)

  }

  dbVariable() {
    return this.db
  }

  static getInstance():DBConnection { 
    if(!DBConnection.instance){
      DBConnection.instance = new DBConnection()
    }
    return DBConnection.instance
  }
}

const db = DBConnection.getInstance().dbVariable();

db.raw("SELECT VERSION()").then(() => {
  console.log("database is connected successfully");
}).catch((err:any) => {
console.error('error connecting: ', err)
throw new Error("db not connected")
}
);

export default db;