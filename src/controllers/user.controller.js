const userService = require('../services/users.service');

async function getAll(req, res, next) {
    try {
        const users = await userService.getAll();
        res.status(200).send(users);
    } catch(err) {
        next(err);
    }
}

async function save(req, res, next) {
    try {
        const user = await userService.save(req.body);
        res.status(200).send(user);
    } catch(err) {
        next(err);
    }
}

async function login(req, res, next){
    try{
        const user = await userService.login(req.body);
        if(user)
            res.status(200).send(user);
        else
            res.status(404).send("Ïncorrect credentials!");
    } catch(err) {
        next(err);
    }
}

module.exports = {getAll, save, login};