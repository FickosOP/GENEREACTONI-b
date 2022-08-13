const { MongoClient } = require('mongodb');
const { DB_URI, DB_NAME } = require('../config');

const client = new MongoClient(DB_URI);
const ObjectId = require('mongodb').ObjectId;

client.connect();

const database = client.db(DB_NAME);

async function save(coll, obj){
    const created =  await database.collection(coll).insertOne(obj);
    return {...created, ...obj};
}

async function getAll(coll){
    return await database.collection(coll).find().toArray();
}

async function getOne(coll, id){
    return await database.collection(coll).findOne(id);
}

async function update(coll, id, obj){
    return await database.collection(coll).updateOne({_id: ObjectId(id)}, { $set: {...obj} });
}

async function getOneByUsername(coll, username){
    return await database.collection(coll).findOne({ username });
}

async function deleteOne(coll, id){

}

async function getAllForUserId(coll, userId){
    return await database.collection(coll).find({userId: userId}).toArray();
}

async function modelExists(coll, userId, modelName){
    return await database.collection(coll).findOne({userId: userId, name: modelName});
}

module.exports = { save, getAll, getOne, update, deleteOne, getOneByUsername, getAllForUserId, modelExists }