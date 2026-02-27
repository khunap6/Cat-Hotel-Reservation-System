module.exports = {
  port: process.env.PORT || 8081,
  db: {
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || './cat-hotel-db.sqlite',
    logging: false,
  },
  authentication: {
    jwtSecret: process.env.JWT_SECRET || 'cat-hotel-secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
}