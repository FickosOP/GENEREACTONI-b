
const modelService = require('../services/model.service');

async function getAllForUser(req, res, next){

}

async function save(req, res, next){

}

async function generateComponent(req, res, next){
    modelService.generateComponent(req.body);
    res.status(200).send("Generated component!");
}

module.exports = { getAllForUser, save, generateComponent };