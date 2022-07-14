const express = require('express');
const app = express();

const generateComponentContent = require('./service/generateComponent');
const generateProject = require('./service/generateProject');

const fs = require('fs');
const { nextTick } = require('process');

app.use(express.json());

app.get('/', (req, res) => {
    res.send(`Successful request`);
});


app.post('/component', generateComponentContent, (req, res) => {
    
    return res.status(200).send('OK');
});

app.post('/project', generateProject, (req, res) => {
    
    return res.status(200).send('OK');
});

app.listen(3000, console.log('Listening on port 3000...'));