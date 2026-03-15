const { Cat, User } = require('../models')

module.exports = {
  async myCats(req, res) {
    const cats = await Cat.findAll({ where: { userId: req.user.id }, order: [['id', 'DESC']] })
    res.send(cats)
  },

  async create(req, res) {
    const { name, breed, gender, age, weight, note, imageUrl } = req.body
    if (!name) return res.status(400).send({ error: 'name is required' })
    const cat = await Cat.create({ userId: req.user.id, name, breed, gender, age, weight, note, imageUrl })
    res.send(cat)
  },

  async update(req, res) {
    const cat = await Cat.findByPk(req.params.id)
    if (!cat) return res.status(404).send({ error: 'Cat not found' })
    if (cat.userId !== req.user.id) return res.status(403).send({ error: 'Forbidden' })
    const fields = ['name','breed','gender','age','weight','note','imageUrl']
    fields.forEach((f) => { if (req.body[f] !== undefined) cat[f] = req.body[f] })
    await cat.save()
    res.send(cat)
  },

  // admin: list all cats with owner info
  async all(req, res) {
    const cats = await Cat.findAll({
      order: [['id', 'DESC']],
      include: [{ model: User, as: 'owner', attributes: ['id','name','email'] }]
    })
    // map to include cat.user for frontend compatibility
    const mapped = cats.map(c => ({ ...c.toJSON(), user: c.owner }))
    res.send(mapped)
  },

  async remove(req, res) {
    const cat = await Cat.findByPk(req.params.id)
    if (!cat) return res.status(404).send({ error: 'Cat not found' })
    if (cat.userId !== req.user.id) return res.status(403).send({ error: 'Forbidden' })
    await cat.destroy()
    res.send({ ok: true })
  },
}
