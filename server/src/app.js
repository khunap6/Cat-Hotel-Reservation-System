const express = require('express')
const cors = require('cors')

const { sequelize, User, Room } = require('./models')
const config = require('./config/config')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// JWT Strategy
require('./userPassport')
const passport = require('passport')
app.use(passport.initialize())

// Routes
require('./routes')(app)

// Sync DB + seed admin/rooms (ครั้งแรก)
async function seed() {
  // seed admin (ถ้ายังไม่มี)
  const adminEmail = 'admin@cat-hotel.com'
  const found = await User.findOne({ where: { email: adminEmail } })
  if (!found) {
    await User.create({
      email: adminEmail,
      password: 'admin1234',
      name: 'Admin',
      role: 'admin',
    })
    console.log('✅ Seed admin => admin@cat-hotel.com / admin1234')
  }

  // seed rooms (ถ้ายังไม่มี)
  const roomCount = await Room.count()
  if (roomCount === 0) {
    await Room.bulkCreate([
      { name: 'Standard A', type: 'Standard', pricePerNight: 300, capacityCats: 1, status: 'available' },
      { name: 'Deluxe B', type: 'Deluxe', pricePerNight: 500, capacityCats: 1, status: 'available' },
      { name: 'VIP C', type: 'VIP', pricePerNight: 800, capacityCats: 2, status: 'available' },
    ])
    console.log('✅ Seed rooms created')
  }
}

sequelize
  .sync({ force: false })
  .then(async () => {
    await seed()
    app.listen(config.port, () => {
      console.log(`CAT-Hotel API running at http://localhost:${config.port}`)
    })
  })
  .catch((err) => console.error('DB sync error:', err))

module.exports = app