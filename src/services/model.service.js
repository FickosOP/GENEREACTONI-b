const collectionName = "projects";

const modelRepository = require('../repositories/repository');

const nunjucks = require('nunjucks');
nunjucks.configure('services/templates', { autoescape: false });

const fs = require('fs');

const path = require('path');

const DOMParser = require('xmldom').DOMParser;

//METHODS
async function save(model){
    return await modelRepository.save(collectionName, model);
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
    component.return = await dynamize(component.return);
    await component.children.map((child) => {
        let relative = _calculateRelativePath(`${component.path}/${component.name}`, `${child.absolutePath}/${child.name}`);
        child.relativePath = relative == "" ? "./" : relative.replace("\\", "/") + '/';
    });
    retval = nunjucks.render('component.template', component, (err, res) => { //dynamize html
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

    nunjucks.render('config.template', pages, (err, res) => {
        if(!err){
            fs.writeFile(`${path}/src/config.js`, res, (err) => {
                return false;
            })
        }
    })
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

function _calculateRelativePath(parentPath, childPath){
    return path.relative(path.dirname(parentPath), path.dirname(childPath));
}

async function dynamize(html){
    //VALIDACIJE DA LI POSTOJE SVE STVARI KOJE KORISTE
    let parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const elements = Array.from(doc.getElementsByTagName("*")); 
    elements.forEach((el) => {
        attributes = Array.from(el.attributes);
        attributes.forEach((attr) => {
            attr_tokens = String(attr.value).split('-');
            console.log(attr_tokens);
            if(attr.name==='name' && attr_tokens[0] === 'dyn'){
                if(attr_tokens[1] === 'value'){ //check if value exists in props or states
                    el.firstChild.data = `{${attr_tokens[2]}}`;
                }
                else if(attr_tokens[1] === 'placeholder'){
                    el.setAttribute('placeholder', `{${attr_tokens[2]}}`);
                }
                else if(attr_tokens[1] === 'for'){
                    console.log(el.textContent);
                    el.textContent = `{  ${attr_tokens[2]}.map((el) => {return(\"\")})}`;
                }
            }
        });
        el.removeAttribute('xmlns');
    });
    console.log(elements[0] + "");
    return elements[0] + "";
}

async function generateProject(model, output_dir){
    await generateProjectStructure(output_dir);
    _generateComponents(model.components, model.pages);
    _appTemplate(output_dir.folder, model);
    _packageTemplate(output_dir.folder, "genereactoni");
    _generateServices(output_dir.folder, model.services);
    _generateUtils(output_dir.folder, model.utils);
    _generatePublic(output_dir.folder);
    return true;
}

async function getAllForUser(userId){
    return modelRepository.getAllForUserId(collectionName, userId);
}

async function getById(id){
    return modelRepository.getOne(collectionName, id);
}

module.exports = { save, generateProject, getAllForUser, getById };