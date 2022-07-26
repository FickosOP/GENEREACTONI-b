
const modelService = require('../services/model.service');

async function getAllForUser(req, res, next){

}

async function save(req, res, next){

}

// async function generateComponent(req, res, next){
//     const success = await modelService.generateComponent(req.body, "../newfolder/components");
//     if(success)
//         res.status(200).send("Generated component!");
//     else
//         res.status(400).send();
// }

async function generateProject(req, res, next){
    const success = await modelService.generateProject(req.body.model, req.body.structure);
    console.log(success);
    res.status(200).send("generated");
}

module.exports = { getAllForUser, save, generateProject };