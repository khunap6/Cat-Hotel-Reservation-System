const passport = require('passport')

const requireAuth = passport.authenticate('jwt', { session: false })

const requireAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).send({ error: 'Unauthorized' })
  if (req.user.role !== 'admin') return res.status(403).send({ error: 'Admin only' })
  return next()
}

module.exports = {
  requireAuth,
  requireAdmin,
}