const { Announcement } = require('../models')

// ===== ลูกค้า: ดูประกาศ =====
module.exports.list = async (req, res) => {
  const list = await Announcement.findAll({
    where: { isActive: true },
    order: [['createdAt', 'DESC']]
  })
  res.send(list)
}

// ===== ลูกค้า: ดูรายละเอียด =====
module.exports.show = async (req, res) => {
  const item = await Announcement.findByPk(req.params.id)
  res.send(item)
}

// ===== Admin: สร้างประกาศ =====
module.exports.create = async (req, res) => {
  const item = await Announcement.create(req.body)
  res.send(item)
}

// ===== Admin: แก้ =====
module.exports.update = async (req, res) => {
  const item = await Announcement.findByPk(req.params.id)
  if (!item) return res.status(404).send({ error: 'Not found' })

  await item.update(req.body)
  res.send(item)
}

// ===== Admin: ลบ =====
module.exports.remove = async (req, res) => {
  const item = await Announcement.findByPk(req.params.id)
  if (!item) return res.status(404).send({ error: 'Not found' })

  await item.destroy()
  res.send(item)
}