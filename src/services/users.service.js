
const collectionName = "users";

const userRepository = require('../repositories/repository');
const jwt = require('jsonwebtoken');

require('dotenv').config();

async function getAll(){
    return await userRepository.getAll(collectionName);
}

async function save(user){
    if(!(user.username && user.password))
        throw new Error('One of the required fields is empty');
    var oldUser = await userRepository.getOne(collectionName, {username: user.username});
    if(oldUser)
        throw new Error('Username already exists');
    if(user.email){
        oldUser = await userRepository.getOne(collectionName, {email: user.email});
        if(oldUser)
            throw new Error('Email already exists');
    }
    const token = jwt.sign(
        {user_id: user.username},
        process.env.TOKEN_KEY,
        {
            expiresIn: '1h'
        }
    );
    user.token = token;

    return await userRepository.save(collectionName, user);
}

async function login(loginDto){
    const user = await userRepository.getOneByUsername(collectionName, loginDto.username);
    user.token = jwt.sign(
        {user_id: user.username},
        process.env.TOKEN_KEY,
        {
            expiresIn: '1h'
        }
    );
    if(user?.password != loginDto.password)
        return;
    return user;
}

module.exports = { getAll, save, login };