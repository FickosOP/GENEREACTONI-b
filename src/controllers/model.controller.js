
const modelService = require('../services/model.service');

async function getAllForUser(req, res, next){

}

async function save(req, res, next){

}

async function generateProject(req, res, next){
    const success = await modelService.generateProject(req.body.model, req.body.structure);
    res.status(200).send(success);
}

module.exports = { getAllForUser, save, generateProject };