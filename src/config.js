// const express = require('express');
// const app = express();

// app.use(express.json());

// const {MongoClient} = require('mongodb');

// const uri = "mongodb://localhost:27017";

// const client = new MongoClient(uri);

// client.connect();

// module.exports = {app, client};

const DB_URI = "mongodb://localhost:27017";
const PORT = process.env.port || 3000;

module.exports = { DB_URI, PORT };