const { MongoClient } = require("mongodb");

const _uri = "mongodb://127.0.0.1:27017";

const dbConnection = (collection, cb) => {
  MongoClient.connect(_uri)
    .then(async (client) => {
      const db = client.db("nodejs-project").collection(collection);
      await cb(db);
      client.close();
    })
    .catch();
};

module.exports = dbConnection;
