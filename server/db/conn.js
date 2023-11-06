const { MongoClient } = require("mongodb");

const connectionString = process.env.ATLAS_URI || "";
const client = new MongoClient(connectionString);

let db;

async function getDb() {
  if (db) return db;

  await client.connect();

  db = client.db("spotify-applemusic");
  console.log(db);
  return db;
}

module.exports = { getDb };