const collectionName = "projects";

const modelRepository = require('../repositories/repository');

const nunjucks = require('nunjucks');

const fs = require('fs');

async function save(model){
    return await modelRepository.save(collectionName, model);
}

async function generateComponent(component, output_dir){
    nunjucks.configure('services/templates', { autoescape: false });
    retval = nunjucks.render('component.template', component, (err, res) => {
        if(!err){
            // console.log(res);
            fs.writeFile(`${output_dir}/${component.name}.jsx`, res, (err) => {
                return false;
            })
        }
    });
    return true;
}

async function generateService(){

}

async function generateProjectStructure(output_dir){
    console.log(`Dobiven: ${output_dir.folder}`);
    const folderName = output_dir.folder;
    fs.access(folderName, (err) => {
        if(err){
            console.log(`Directory ${folderName} does not exist`);
            fs.mkdirSync(folderName);
            console.log(`Directory ${folderName} created!`);
            generateProjectStructure(output_dir);
        }
        else{
            console.log(`Directory ${folderName} exists`);
            console.log(`Subfolders: ${output_dir.subfolders.length}`);
            for(let sub of output_dir.subfolders){
                console.log("sub");
                console.log(sub);
                sub.folder = `${folderName}/${sub.folder}`;
                generateProjectStructure(sub);
            }
        }
    })
}


async function generateProject(model, output_dir){
    generateProjectStructure(output_dir);
    return true;
}

module.exports = { save, generateComponent, generateProject };