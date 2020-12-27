const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const JWT_SECRET = process.env.JWT_SECRET || 'jsj'
const validateEmail = require('../utils/validateEmail')
const cookie = require('cookie')

exports.register = async (req, res) => {
  const { name, email, password } = req.body
  let errors = {}

  // validation
  if (!validateEmail(email)) errors.email = 'Incorrect email address'
  if (name.trim().length === 0) errors.name = 'Name must be required'
  if (password === '') errors.password = 'Password must be required'

  // if any errors return to client
  if (Object.keys(errors).length > 0) return res.status(422).json(errors)

  try {
    // check duplicate email
    const emailUser = await User.findOne({ email })
    if (emailUser) {
      return res.status(400).json({
        email: 'Email already taken',
      })
    }

    // hash the password for security purpose
    const hashPassword = await bcrypt.hash(password, 12)

    const user = new User({ email, name, password: hashPassword })

    await user.save()
    return res.status(201).json({ message: 'Register Successfully' })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body
  let errors = {}

  // validation
  if (!validateEmail(email)) errors.email = 'Incorrect email address'
  if (password === '') errors.password = 'Password must be required'

  // if any errors return to client
  if (Object.keys(errors).length > 0) return res.status(422).json(errors)

  try {
    // check email exists
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ email: 'User not found' })

    // check password is correct
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch)
      return res.status(401).json({ password: 'Invalid Credentials' })

    // generate token to authenticate user on further request

    const token = jwt.sign({ userId: user._id }, JWT_SECRET)
    // add jwt to cookie for security purpose because localStorage can generate some issuues related to security and not good expriences

    res.set(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600,
        path: '/',
      }),
    )

    return res.status(201).json({ message: 'Login Successfully' })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

//  Get user Data
exports.me = async (_, res) => {
  try {
    return res.status(200).json(res.locals.user)
  } catch (err) {
    console.log(err)
    return res.status(401).json({ error: 'Something went wrong' })
  }
}

exports.logout = (_, res) => {
  try {
    res.set(
      'Set-Cookie',
      cookie.serialize('token', '', {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        expires: new Date(0),
        path: '/',
      }),
    )
    return res
      .status(200)
      .json({ success: true, message: 'Logout Successfully' })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}
