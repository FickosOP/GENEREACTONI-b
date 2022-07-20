const express = require('express');
const router = express.Router();

const modelController = require('../controllers/model.controller');

router.get('/:userId', modelController.getAllForUser);

// router.get('/:id');

router.post('/', modelController.save);

// router.put('/:id');

// router.delete('/:id');

router.post('/:projectId', modelController.generateComponent);

module.exports = router;