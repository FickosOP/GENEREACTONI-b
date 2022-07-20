
const collectionName = "users";

const userRepository = require('../repositories/repository');

async function getAll(){
    const allUsers = await userRepository.getAll(collectionName);
    console.log("SVI" + allUsers);
    return allUsers;
}

async function save(user){
    const saved = await userRepository.save(collectionName, user);
    console.log(saved);
    return saved;
}

module.exports = { getAll, save };