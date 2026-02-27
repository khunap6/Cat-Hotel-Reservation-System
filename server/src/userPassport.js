const passport = require('passport')
const { User } = require('./models')
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt')
const config = require('./config/config')

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.authentication.jwtSecret,
    },
    async (payload, done) => {
      try {
        const user = await User.findByPk(payload.id, { attributes: { exclude: ['password'] } })
        if (!user) return done(null, false)
        return done(null, user)
      } catch (err) {
        return done(err, false)
      }
    }
  )
)

module.exports = null