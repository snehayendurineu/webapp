const userController = require('../controllers/userController.js')
const express = require('express');
const router = express.Router();

const healthController = require('../controllers/healthCheckController');
router.get('/healthz', healthController.checkHealth);

router.post('/v11/user', userController.addUser)
router.get('/v11/user/self', userController.getUser)
router.put('/v11/user/self', userController.updateUser)
router.delete('/v11/user/self', userController.deleteUser)
router.get('/v11/user/self/verify/:id', userController.verifyUser)

module.exports = router;
