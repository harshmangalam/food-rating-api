const express = require('express')
const { login, logout, register, me } = require('../controllers/authController')
const router = express.Router()
const checkAuth = require('../middleware/checkAuth')

// routes endpoint

router.post('/login', login)
router.post('/register', register)
router.get('/me', checkAuth, me)
router.get('/me', checkAuth, logout)

module.exports = router
