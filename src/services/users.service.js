
const collectionName = "users";

const userRepository = require('../repositories/repository');

async function getAll(){
    return await userRepository.getAll(collectionName);
}

async function save(user){
    return await userRepository.save(collectionName, user);
}

async function login(loginDto){
    const user = await userRepository.getOneByUsername(collectionName, loginDto.username);
    if(user.password != loginDto.password)
        return;
    return user;
}

module.exports = { getAll, save, login };