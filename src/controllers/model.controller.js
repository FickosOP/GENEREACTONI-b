
const modelService = require('../services/model.service');

async function getAllForUser(req, res, next){
    const models = await modelService.getAllForUser(req.user.user_id);
    res.status(200).send(models);
}

async function save(req, res, next){
    const saved = await modelService.save({...req.body, userId: req.user.user_id});
    res.status(200).send(saved);
}

async function getById(req, res, next){
    const result = await modelService.getById(req.params.id);
    res.status(200).send(result);
}

async function generateProject(req, res, next){
    const success = await modelService.generateProject(req.body.model, req.body.structure);
    res.status(200).send(success);
}

module.exports = { getAllForUser, save, generateProject, getById };