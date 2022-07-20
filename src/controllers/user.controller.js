const userService = require('../services/users.service');

async function getAll(req, res, next) {
    try {
        const users = await userService.getAll();
        res.status(200).send(users);
    } catch(err) {
        console.log("dwadawdaw");
        next(err);
    }
}

async function save(req, res, next) {
    try {
        const user = await userService.save(req.body);
        res.status(200).send(user);
    } catch(err) {
        console.log("dwadwdawd");
        next(err);
    }
}

module.exports = {getAll, save};