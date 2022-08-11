const express = require('express');
const router = express.Router();

const auth = require("../middleware/auth");

const modelController = require('../controllers/model.controller');

router.get('/user/:userId', auth, modelController.getAllForUser);

router.get('/:id', modelController.getById);

router.post('/', modelController.save);

// router.put('/:id');

// router.delete('/:id');

// router.post('/component/:projectId', modelController.generateComponent);

router.post('/generate', modelController.generateProject);

module.exports = router;