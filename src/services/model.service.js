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
    const folderName = output_dir.folder;
    fs.access(folderName, (err) => {
        if(err){
            // console.log(`Directory ${folderName} does not exist`);
            fs.mkdirSync(folderName);
            // console.log(`Directory ${folderName} created!`);
            generateProjectStructure(output_dir);
        }
        else{
            // console.log(`Directory ${folderName} exists`);
            // console.log(`Subfolders: ${output_dir.subfolders.length}`);
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
            fs.writeFile(`${component.path}/${component.name}.jsx`, res, (err) => {
                return false;
            })
        }
    });
}

async function _appTemplate(path, pages){
    nunjucks.render('app.template', pages, (err, res) => {
        if(!err){
            fs.writeFile(`${path}/src/App.js`, res, (err) => {
                return false;
            })
        }
    });

    nunjucks.render('index-js.template', pages, (err, res) => {
        if(!err){
            fs.writeFile(`${path}/src/index.js`, res, (err) => {
                return false;
            })
        }
    });
}

async function _packageTemplate(path, name){
    retval = nunjucks.render('package.template', {name}, (err, res) => {
        if(!err){
            fs.writeFile(`${path}/package.json`, res, (err) => {
                return false;
            })
        }
    })
}

async function _generateServices(path, services){
    retval = nunjucks.render('service.template', {services}, (err, res) => {
        if(!err){
            fs.writeFile(`${path}/src/services/services.js`, res, (err) => {
                return false;
            })
        }
    })
}

async function _generateUtils(path, utils){
    retval = nunjucks.render('util.template', {utils}, (err, res) => {
        if(!err){
            fs.writeFile(`${path}/src/utils/utils.js`, res, (err) => {
                return false;
            })
        }
    })
}

async function _generatePublic(path){
    retval = nunjucks.render('index-html.template', {}, (err, res) => {
        if(!err){
            fs.writeFile(`${path}/public/index.html`, res, (err) => {
                return false;
            })
        }
    })
}

async function generateProject(model, output_dir){
    generateProjectStructure(output_dir);
    _generateComponents(model.components, model.pages);
    _appTemplate(output_dir.folder, model);
    _packageTemplate(output_dir.folder, "genereactoni");
    _generateServices(output_dir.folder, model.services);
    _generateUtils(output_dir.folder, model.utils);
    _generatePublic(output_dir.folder);
    return true;
}

module.exports = { save, generateComponent, generateProject };