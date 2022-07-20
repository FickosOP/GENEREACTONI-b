const {MongoClient} = require('mongodb');

const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);

client.connect();
//genereactoni da se cita iz configa
async function save(coll, obj){
    return client.db('genereactoni').collection(coll).insertOne(obj);
}

async function getAll(coll){
    const all = await client.db('genereactoni').collection(coll).find().toArray();
    console.log(all);
    return all;
}

async function getOne(coll, id){
    return client.db('genereactoni').collection(coll).findOne(id);
}

async function update(coll, id, obj){

}

async function deleteOne(coll, id){

}

module.exports = {save, getAll, getOne, update, deleteOne}