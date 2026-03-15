const { Room } = require('../models')

module.exports = {
  async list(req, res) {
    const rooms = await Room.findAll({ order: [['id', 'DESC']] })
    res.send(rooms)
  },

  async create(req, res) {
    const { name, type, pricePerNight, capacityCats, description, status, imageUrl } = req.body
    if (!name || !type) return res.status(400).send({ error: 'name and type are required' })
    const room = await Room.create({
      name, type,
      pricePerNight: pricePerNight ?? 0,
      capacityCats: capacityCats ?? 1,
      description,
      imageUrl: imageUrl || null,
      status: status ?? 'available',
    })
    res.send(room)
  },

  async update(req, res) {
    const room = await Room.findByPk(req.params.id)
    if (!room) return res.status(404).send({ error: 'Room not found' })
    const fields = ['name', 'type', 'pricePerNight', 'capacityCats', 'description', 'status', 'imageUrl']
    fields.forEach((f) => { if (req.body[f] !== undefined) room[f] = req.body[f] })
    await room.save()
    res.send(room)
  },

  async remove(req, res) {
    const room = await Room.findByPk(req.params.id)
    if (!room) return res.status(404).send({ error: 'Room not found' })
    await room.destroy()
    res.send({ message: 'Deleted', id: Number(req.params.id) })
  },
}
