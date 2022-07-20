const fs = require('fs');

function addComponents(path, components){
    fs.mkdir(`${path}/components`, (e) => {
        if(!e || (e && e.code === 'EEXIST')){
            //do sth
            console.log('Directory already exists');
            return;
        } 
        else{
            //debug
            console.log(e);
        }
    });
    // components.map((component) => {
    // GENERATE COMPONENT
    // });
}

function addPages(path, pages){
    fs.mkdir(`${path}/pages`, (e) => {
        if(!e || (e && e.code === 'EEXIST')){
            //do sth
            console.log('Directory already exists');
            return;
        } 
        else{
            //debug
            console.log(e);
        }
    });
}

function addServices(path, services){
    fs.mkdir(`${path}/services`, (e) => {
        if(!e || (e && e.code === 'EEXIST')){
            //do sth
            console.log('Directory already exists');
            return;
        } 
        else{
            //debug
            console.log(e);
        }
    });
}

function addUtils(path, utils){
    fs.mkdir(`${path}/utils`, (e) => {
        if(!e || (e && e.code === 'EEXIST')){
            //do sth
            console.log('Directory already exists');
            return;
        } 
        else{
            //debug
            console.log(e);
        }
    });
}

function addApp(path, pages){
    content = "";
    content += 'import React, { Component } from \'react\';\nimport { BrowserRouter as Router, Routes, Route } from \'react-router-dom\';\n';

    pages.map((page) => {
        content += `import ${page.name} from "./pages/${page.name}"\n`;
    });

    content += 'export default class App extends Component {\n\n\trender() {\n\treturn (\n\t<div>\n\t\t<Router>\n\t\t\t<Routes>\n';

    pages.map((page) => {
        content += `\t\t\t\t<Route exact path="${page.name}" element={<${page.name} />} />\n`;
    });
    content += `\t\t\t\t<Route path="*" element={<h1>404 Not found</h1>} />\n`
    content += '\t\t\t</Routes>\n\t\t</Router>\n\t</div>\n\t);\n}\n}'
    fs.writeFile(`${path}/App.js`, content, (err) => {
        console.log(err);
        return;
    });
}

function generateProject(req, res, next){
    console.log(req.body);
    fs.mkdir(req.body.path, (e) => {
        if(!e || (e && e.code === 'EEXIST')){
            //do sth
            console.log('Directory already exists');
            next();
        } 
        else{
            //debug
            console.log(e);
        }
    });

    addComponents(req.body.path, req.body.components);
    addPages(req.body.path, req.body.pages);
    addServices(req.body.path, req.body.services);
    addUtils(req.body.path, req.body.utils);
    addApp(req.body.path, req.body.pages);


    next();
}

module.exports = generateProject;