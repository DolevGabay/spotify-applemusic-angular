const { MongoClient } = require("mongodb");

const connectionString = process.env.ATLAS_URI || "";
const client = new MongoClient(connectionString);

let dbInstance;
class Database {
  constructor() {
    if (!dbInstance) {
      this.client = client;
      this.client.connect().then(() => {
        this.db = this.client.db('spotify-applemusic');
      });
      dbInstance = this;
    }
    return dbInstance;
  }

  async getDb() {
    return this.db;
  }ß
}

module.exports = new Database();