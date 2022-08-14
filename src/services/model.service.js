const collectionName = "projects";

const modelRepository = require('../repositories/repository');

const nunjucks = require('nunjucks');
nunjucks.configure('services/templates', { autoescape: false });

const fs = require('fs');

const path = require('path');

const DOMParser = require('xmldom').DOMParser;

//METHODS
async function save(model){
    const existing = await modelRepository.modelExists(collectionName, model.userId, model.name);
    if(!existing)
        return await modelRepository.save(collectionName, model);
    else
        return await modelRepository.update(collectionName, existing._id, model);
}


async function generateProjectStructure(output_dir, level = 0){
    if(level === 0){
        output_dir.folder = `./output/${output_dir.folder}`;
    }
    const folderName = output_dir.folder;
    try{
        fs.accessSync(folderName, fs.constants.R_OK | fs.constants.W_OK);
        for(let sub of output_dir.subfolders){
            sub.folder = `${folderName}/${sub.folder}`;
            generateProjectStructure(sub, ++level);
        }
    }
    catch(err){
        fs.mkdirSync(folderName);
        generateProjectStructure(output_dir, ++level);
    }
    // fs.access(folderName, (err) => {
        
    //     if(err){
    //         // console.log(`Directory ${folderName} does not exist`);
    //         fs.mkdirSync(folderName);
    //         // console.log(`Directory ${folderName} created!`);
    //         generateProjectStructure(output_dir, ++level);
    //     }
    //     else{
    //         // console.log(`Directory ${folderName} exists`);
    //         // console.log(`Subfolders: ${output_dir.subfolders.length}`);
    //         for(let sub of output_dir.subfolders){
    //         sub.folder = `${folderName}/${sub.folder}`;
    //         generateProjectStructure(sub, ++level);
    //     }
    //     }
    // });
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
    // component.return = await dynamize(component.return); //UNCOMMENT WHEN GUARDS ARE IMPLEMENTED
    component.children.map((child) => {
        let relative = _calculateRelativePath(`${component.path}/${component.name}`, `${child.absolutePath}/${child.name}`);
        child.relativePath = relative == "" ? "./" : relative.replace("\\", "/") + '/';
    });
    await _generateAndWriteToFile('component.template', `./output/${component.path}/${component.name}.jsx`, component);
}

async function _appTemplate(path, pages){
    await _generateAndWriteToFile('app.template', `${path}/src/App.js`, pages);
    
    await _generateAndWriteToFile('index-js.template', `${path}/src/index.js`, pages);
    
    return _generateAndWriteToFile('config.template', `${path}/src/config.js`, pages);
}

async function _packageTemplate(path, name){
    return _generateAndWriteToFile('package.template', `${path}/package.json`, {name})
}

async function _generateServices(path, services){
    return _generateAndWriteToFile('service.template', `${path}/src/services/services.js`, {services});
}

async function _generateUtils(path, utils){
    return _generateAndWriteToFile('util.template', `${path}/src/utils/utils.js`, {utils});
}

async function _generateAndWriteToFile(template, path, data={}){
    return new Promise((resolve, reject) => {
        
        nunjucks.render(template, data, (err, res) => {
            if(!err){
                fs.writeFile(path, res, (err) => {
                    if(!err){
                        resolve();
                    } else {
                        reject(`Error when writing a file ${path}`);
                    }
                });
            } else {
                reject(`Error when rendering ${template}`);
            }
        });
    });
}

async function _generatePublic(path){
    return _generateAndWriteToFile('index-html.template', `${path}/public/index.html`);
}

function _calculateRelativePath(parentPath, childPath){
    return path.relative(path.dirname(parentPath), path.dirname(childPath));
}

async function dynamize(html){
    //VALIDACIJE DA LI POSTOJE SVE STVARI KOJE KORISTE
    if(!html){
        return '<></>';
    }
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
        el.removeAttribute('xmlns'); //not working
    });
    console.log(elements[0] + "");
    return elements[0] + "";
}

async function generateProject(model, output_dir){
    await generateProjectStructure(output_dir, 0);

    await _generateComponents(model.components, model.pages);

    await _appTemplate(output_dir.folder, model);

    await _packageTemplate(output_dir.folder, "genereactoni");

    await _generateServices(output_dir.folder, model.services);

    await _generateUtils(output_dir.folder, model.utils);

    await _generatePublic(output_dir.folder);

    return output_dir.folder;
}

async function getAllForUser(userId){
    return modelRepository.getAllForUserId(collectionName, userId);
}

async function getById(id){
    return modelRepository.getOne(collectionName, id);
}

module.exports = { save, generateProject, getAllForUser, getById };