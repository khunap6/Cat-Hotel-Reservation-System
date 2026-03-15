const { User, Cat, Room, Reservation } = require('../models')
const { Op } = require('sequelize')

module.exports = {
  async dashboard(req, res) {
    try {
      const today = new Date().toISOString().split('T')[0]

      const [totalCustomers, totalCats, totalRooms, totalReservations,
             pendingReservations, todayCheckIns, totalRevenue] = await Promise.all([
        User.count({ where: { role: 'customer' } }),
        Cat.count(),
        Room.count(),
        Reservation.count(),
        Reservation.count({ where: { status: 'pending' } }),
        Reservation.count({ where: { checkIn: today } }),
        Reservation.findAll({
          where: { status: { [Op.in]: ['approved', 'checked_in', 'completed'] } },
          include: [{ model: Room, as: 'room' }]
        })
      ])

      const revenue = totalRevenue.reduce((sum, r) => {
        if (!r.room) return sum
        const nights = Math.max(1, Math.ceil(
          (new Date(r.checkOut) - new Date(r.checkIn)) / (1000 * 60 * 60 * 24)
        ))
        return sum + (r.room.pricePerNight * nights)
      }, 0)

      res.send({
        totalCustomers,
        totalCats,
        totalRooms,
        totalReservations,
        pendingReservations,
        todayCheckIns,
        totalRevenue: revenue
      })
    } catch (err) {
      console.error(err)
      res.status(500).send({ error: 'Failed to load stats' })
    }
  }
}
