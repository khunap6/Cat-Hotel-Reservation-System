const jwt = require('jsonwebtoken')
const config = require('../config/config')
const { User } = require('../models')

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.authentication.jwtSecret,
    { expiresIn: config.authentication.jwtExpiresIn }
  )
}

module.exports = {
  async register(req, res) {
    try {
      const { email, password, name, phone } = req.body
      if (!email || !password || !name) {
        return res.status(400).send({ error: 'email, password, name are required' })
      }

      const exists = await User.findOne({ where: { email } })
      if (exists) return res.status(409).send({ error: 'Email already exists' })

      const user = await User.create({ email, password, name, phone, role: 'customer' })
      const token = signToken(user)

      return res.send({
        token,
        user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role },
      })
    } catch (err) {
      return res.status(500).send({ error: 'Register failed', detail: String(err) })
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body
      if (!email || !password) return res.status(400).send({ error: 'email and password are required' })

      const user = await User.findOne({ where: { email } })
      if (!user) return res.status(401).send({ error: 'Invalid credentials' })

      const ok = await user.comparePassword(password)
      if (!ok) return res.status(401).send({ error: 'Invalid credentials' })

      const token = signToken(user)
      return res.send({
        token,
        user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role },
      })
    } catch (err) {
      return res.status(500).send({ error: 'Login failed', detail: String(err) })
    }
  },

  async me(req, res) {
    // requireAuth มาก่อน
    return res.send({ user: req.user })
  },
}