const collectionName = "models";

const modelRepository = require('../repositories/repository');

const nunjucks = require('nunjucks');

async function save(model){
    const saved = await modelRepository.save(collectionName, model);

    return saved;
}

async function generateComponent(component, output_dir){
    nunjucks.configure('services/templates', { autoescape: false });
    retval = nunjucks.render('component.template', component);
    console.log(retval);
}

async function generateService(){

}

async function generateProject(model, output_dir){

}

module.exports = { generateComponent };