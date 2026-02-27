const { Sequelize, DataTypes } = require('sequelize')
const config = require('../config/config')

const sequelize = new Sequelize({
  dialect: config.db.dialect,
  storage: config.db.storage,
  logging: config.db.logging,
})

const User = require('./User')(sequelize, DataTypes)
const Cat = require('./Cat')(sequelize, DataTypes)
const Room = require('./Room')(sequelize, DataTypes)
const Reservation = require('./Reservation')(sequelize, DataTypes)
const Announcement = require('./Announcement')(sequelize, DataTypes)

// Associations
User.hasMany(Cat, { foreignKey: 'userId', as: 'cats' })
Cat.belongsTo(User, { foreignKey: 'userId', as: 'owner' })

User.hasMany(Reservation, { foreignKey: 'userId', as: 'reservations' })
Reservation.belongsTo(User, { foreignKey: 'userId', as: 'customer' })

Cat.hasMany(Reservation, { foreignKey: 'catId', as: 'reservations' })
Reservation.belongsTo(Cat, { foreignKey: 'catId', as: 'cat' })

Room.hasMany(Reservation, { foreignKey: 'roomId', as: 'reservations' })
Reservation.belongsTo(Room, { foreignKey: 'roomId', as: 'room' })

module.exports = {
  sequelize,
  User,
  Cat,
  Room,
  Reservation,
  Announcement
}