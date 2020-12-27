const jwt = require('jsonwebtoken')
const User = require('../models/user')
const filterUser = require('../utils/filterUser')

const JWT_SECRET = process.env.JWT_SECRET || 'jsj'

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.token
    if (!token) return res.status(401).json({ error: 'token not found' })

    const { userId } = jwt.verify(token, JWT_SECRET)

    const user = await User.findById(userId)

    const userData = filterUser(user)
    res.locals.user = userData
    return next()
  } catch (err) {
    console.log(err)
    return res.status(401).json({ error: err.message })
  }
}
