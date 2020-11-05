const epxress = require('express');

const authController = require('../controllers/auth');

const router = epxress.Router();

router.get('/login', authController.getLogin)
router.post('/login', authController.postLogin)

module.exports = router
