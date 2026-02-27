const { Cat } = require('../models')

module.exports = {
  // customer: list my cats
  async myCats(req, res) {
    const cats = await Cat.findAll({ where: { userId: req.user.id }, order: [['id', 'DESC']] })
    res.send(cats)
  },

  // customer: create cat
  async create(req, res) {
    const { name, breed, gender, age, weight, note } = req.body
    if (!name) return res.status(400).send({ error: 'name is required' })

    const cat = await Cat.create({
      userId: req.user.id,
      name,
      breed,
      gender,
      age,
      weight,
      note,
    })
    res.send(cat)
  },

  // customer: update my cat
  async update(req, res) {
    const cat = await Cat.findByPk(req.params.id)
    if (!cat) return res.status(404).send({ error: 'Cat not found' })
    if (cat.userId !== req.user.id) return res.status(403).send({ error: 'Forbidden' })

    const fields = ['name', 'breed', 'gender', 'age', 'weight', 'note']
    fields.forEach((f) => {
      if (req.body[f] !== undefined) cat[f] = req.body[f]
    })

    await cat.save()
    res.send(cat)
  },

  // admin: list all cats
  async all(req, res) {
    const cats = await Cat.findAll({ order: [['id', 'DESC']] })
    res.send(cats)
  },
}