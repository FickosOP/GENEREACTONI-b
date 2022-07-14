const fs = require('fs');
var DOMParser = require('xmldom').DOMParser;


function imports(config){

    if(config.states != []){
        if(config.effects != []){
            return 'import { useState, useEffect } from "react";\n';
        }
        else{
            return 'import { useState } from "react";\n';
        }
    }
}

function states(states){
    let stateContent = '';
    states.map(state => {
        console.log(state);
        stateContent += `\tconst [${state.name}, set${state.name.charAt(0).toUpperCase() + state.name.slice(1)}] = useState(${state.default});\n`
    });
    return stateContent;
}

function effects(effects){
    if(effects != []){ //IMPLEMENT AUTOMATIC useEffect 
        return `\tuseEffect(() => {
            
        }, []);\n`
    }
}

function actions(actions){
    let actionContent = '';
    if(actions != []){
        actions.map(action => {
            actionContent += `\tfunction ${action}(e){\n\t}\n`;
        });
    }
    return actionContent;
}

function dynamicHtml(html){
    let dynamicContent = '';
    if(html){
        dynamicContent += `\treturn (
           ${dynamize(html)}
        );\n`
    }
    else {
        dynamicContent += `\treturn (
            <></>
        );\n`
    }
    return dynamicContent;
}

function dynamize(html){
    //VALIDACIJE DA LI POSTOJE SVE STVARI KOJE KORISTE
    let parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const elements = Array.from(doc.getElementsByTagName("*"));
    var x = "";
    elements.forEach((el) => {
        attributes = Array.from(el.attributes)
        el.removeAttribute('xmlns')
        attributes.forEach((attr) => {
            attr_tokens = String(attr.value).split('-') //DESCRUCTURIZE INTO isDyn, target, value
            console.log(attr_tokens);
            if(attr.name==='name' && attr_tokens[0] === 'dyn'){
                if(attr_tokens[1] === 'value'){
                    el.firstChild.data = '{' + attr_tokens[2] + '}'
                }
                else if(attr_tokens[1] === 'placeholder'){
                    el.setAttribute('placeholder', '{' + attr_tokens[2] + '}')
                }
                else if(attr_tokens[1] === 'for'){
                    console.log(el.textContent);
                    el.textContent = '{' + attr_tokens[2] + '.map((el) => {return(\"\")})}'
                }
            }
        });
    });
    console.log(elements[0] + "");
    return elements[0] + "";
}

function generateComponentContent(req, res, next){ //path and component -> call that function from this middleware
    const config = req.body;
    let content = '';

    content += imports(config)

    if(config.name){
        content += `function ${config.name}(){\n`
    }

    content += states(config.states);

    content += effects(config.effects);

    content += actions(config.actions);

    content += dynamicHtml(config.return);

    content += `}\nexport default ${config.name};`;

    const path = `../newfolder/components/${req.body.name}.jsx`;

    fs.writeFile(path, content, (err) => {
        console.log(err);
    });

    next();
}

module.exports = generateComponentContent;