const { MongoClient } = require('mongodb');
const { DB_URI } = require('../config');

const client = new MongoClient(DB_URI);

client.connect();

const database = client.db('genereactoni');

//genereactoni da se cita iz configa
async function save(coll, obj){
    return await database.collection(coll).insertOne(obj);
}

async function getAll(coll){
    return await database.collection(coll).find().toArray();
}

async function getOne(coll, id){
    return await database.collection(coll).findOne(id);
}

async function update(coll, id, obj){

}

async function getOneByUsername(coll, username){
    return await database.collection(coll).findOne( { username });
}

async function deleteOne(coll, id){

}

module.exports = {save, getAll, getOne, update, deleteOne, getOneByUsername}