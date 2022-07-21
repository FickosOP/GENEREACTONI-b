const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller');

router.get('/', userController.getAll);

// router.get('/:id');

router.post('/', userController.save);

router.post('/login', userController.login);

// router.put('/:id');

// router.delete('/:id');

module.exports = router;