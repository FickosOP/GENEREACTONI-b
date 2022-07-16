// const express = require('express');
// const app = express();

const generateComponentContent = require('./service/generateComponent');
const generateProject = require('./service/generateProject');

const fs = require('fs');
const { nextTick } = require('process');

// app.use(express.json());
const app = require('./config').app;
const client = require('./config').client;

app.get('/', (req, res) => {
    const user = {username: "Fickos", password: "Fickos123", projects: [{name: "project1", description: "p1"}, {name: "project2", description: "p2"}]};
    const result = client.db('genereactoni').collection('users').insertOne(user);
    console.log(result);
    res.send(`Successful request`);
});


app.post('/component', generateComponentContent, (req, res) => {
    
    return res.send();
});

app.post('/project', generateProject, (req, res) => {
    
    return res.status(200).send('OK');
});

app.listen(3000, console.log('Listening on port 3000...'));