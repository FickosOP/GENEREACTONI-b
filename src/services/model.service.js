const collectionName = "projects";

const modelRepository = require('../repositories/repository');

const nunjucks = require('nunjucks');
nunjucks.configure('services/templates', { autoescape: false });

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


async function generateProjectStructure(output_dir){
    console.log(`Dobiven: ${output_dir.folder}`);
    const folderName = output_dir.folder;
    fs.access(folderName, (err) => {
        if(err){
            console.log(`Directory ${folderName} does not exist`);
            fs.mkdirSync(folderName);
            console.log(`Directory ${folderName} created!`);
            for(let file of output_dir.files){
                console.log(`File: ${file}`);
            }
            generateProjectStructure(output_dir);
        }
        else{
            console.log(`Directory ${folderName} exists`);
            console.log(`Subfolders: ${output_dir.subfolders.length}`);
            for(let sub of output_dir.subfolders){
                sub.folder = `${folderName}/${sub.folder}`;
                generateProjectStructure(sub);
            }
        }
    })
}

async function _generateComponents(components, pages){
    for(let component of components){
        _componentTemplate(component);
    }
    for(let page of pages){
        _componentTemplate(page);
    }
}

async function _componentTemplate(component){
    retval = nunjucks.render('component.template', component, (err, res) => {
        if(!err){
            // console.log(res);
            fs.writeFile(`${component.path}/${component.name}.jsx`, res, (err) => {
                return false;
            })
        }
    });
}

async function _appTemplate(path, pages){
    retval = nunjucks.render('app.template', pages, (err, res) => {
        if(!err){
            // console.log(res);
            fs.writeFile(`${path}/App.js`, res, (err) => {
                return false;
            })
        }
    });
}

async function generateProject(model, output_dir){
    generateProjectStructure(output_dir);
    _generateComponents(model.components, model.pages);
    // _generateServices(model.services);
    // _generateUtils(model.utils);
    return true;
}

module.exports = { save, generateComponent, generateProject };