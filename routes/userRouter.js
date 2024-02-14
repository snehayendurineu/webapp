const userController = require('../controllers/userController.js')
const express = require('express');
const router = express.Router();

const healthController = require('../controllers/healthCheckController');
router.get('/healthz', healthController.checkHealth);

router.post('/v1/user', userController.addUser)
router.get('/v1/user/self', userController.getUser)
router.put('/v1/user/self', userController.updateUser)
router.delete('/v1/user/self', userController.deleteUser)

module.exports = router;