const { Reservation, Cat, Room, User } = require('../models')

function isValidDateRange(checkIn, checkOut) {
  // YYYY-MM-DD compare
  return checkIn && checkOut && String(checkIn) < String(checkOut)
}

module.exports = {
  // customer: create reservation (ยืนยันการจอง)
  async create(req, res) {
    const { catId, roomId, checkIn, checkOut, customerNote } = req.body
    if (!catId || !roomId || !checkIn || !checkOut) {
      return res.status(400).send({ error: 'catId, roomId, checkIn, checkOut are required' })
    }
    if (!isValidDateRange(checkIn, checkOut)) {
      return res.status(400).send({ error: 'Invalid date range' })
    }

    const cat = await Cat.findByPk(catId)
    if (!cat) return res.status(404).send({ error: 'Cat not found' })
    if (cat.userId !== req.user.id) return res.status(403).send({ error: 'You can only book with your own cat' })

    const room = await Room.findByPk(roomId)
    if (!room) return res.status(404).send({ error: 'Room not found' })
    if (room.status === 'maintenance') return res.status(400).send({ error: 'Room is under maintenance' })
    if (room.status === 'full') return res.status(400).send({ error: 'Room is full' })

    const reservation = await Reservation.create({
      userId: req.user.id,
      catId,
      roomId,
      checkIn,
      checkOut,
      customerNote,
      status: 'pending',
    })

    res.send(reservation)
  },

  // customer: cancel reservation (ยกเลิกการจอง)
  async cancel(req, res) {
    const r = await Reservation.findByPk(req.params.id)
    if (!r) return res.status(404).send({ error: 'Reservation not found' })
    if (r.userId !== req.user.id) return res.status(403).send({ error: 'Forbidden' })

    // อนุญาตให้ยกเลิกได้เฉพาะ pending/approved (ปรับได้)
    if (!['pending', 'approved'].includes(r.status)) {
      return res.status(400).send({ error: 'Cannot cancel this reservation status' })
    }

    r.status = 'cancelled'
    await r.save()
    res.send(r)
  },

  // customer: list my reservations (ดูสถานะการจอง)
  async my(req, res) {
    const list = await Reservation.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Cat, as: 'cat' },
        { model: Room, as: 'room' },
      ],
      order: [['id', 'DESC']],
    })
    res.send(list)
  },

  // admin: list all reservations
  async all(req, res) {
    const list = await Reservation.findAll({
      include: [
        { model: User, as: 'customer', attributes: ['id', 'email', 'name', 'phone', 'role'] },
        { model: Cat, as: 'cat' },
        { model: Room, as: 'room' },
      ],
      order: [['id', 'DESC']],
    })
    res.send(list)
  },

  // admin: approve
  async approve(req, res) {
    const r = await Reservation.findByPk(req.params.id)
    if (!r) return res.status(404).send({ error: 'Reservation not found' })
    if (r.status !== 'pending') return res.status(400).send({ error: 'Only pending can be approved' })

    r.status = 'approved'
    r.adminNote = req.body.adminNote ?? r.adminNote
    await r.save()
    res.send(r)
  },

  // admin: reject
  async reject(req, res) {
    const r = await Reservation.findByPk(req.params.id)
    if (!r) return res.status(404).send({ error: 'Reservation not found' })
    if (r.status !== 'pending') return res.status(400).send({ error: 'Only pending can be rejected' })

    r.status = 'rejected'
    r.adminNote = req.body.adminNote ?? r.adminNote
    await r.save()
    res.send(r)
  },

  // admin: update status (เข้าพัก/เสร็จสิ้น)
  async setStatus(req, res) {
    const allowed = ['approved', 'checked_in', 'completed']
    const { status, adminNote } = req.body
    if (!allowed.includes(status)) return res.status(400).send({ error: 'Invalid status' })

    const r = await Reservation.findByPk(req.params.id)
    if (!r) return res.status(404).send({ error: 'Reservation not found' })

    r.status = status
    if (adminNote !== undefined) r.adminNote = adminNote
    await r.save()
    res.send(r)
  },
}