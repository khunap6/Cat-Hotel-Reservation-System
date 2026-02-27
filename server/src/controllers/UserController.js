const { User } = require('../models')

// ===== Admin: ดูรายชื่อลูกค้า (role=customer) =====
async function customers(req, res) {
  try {
    const users = await User.findAll({
      where: { role: 'customer' },
      attributes: { exclude: ['password'] },
      order: [['id', 'DESC']],
    })
    res.send(users)
  } catch (err) {
    console.error(err)
    res.status(500).send({ error: 'Failed to load customers' })
  }
}

module.exports = {
  customers,

  // ===== (ของเดิม) get all user =====
  async index(req, res) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] },
      })
      res.send(users)
    } catch (err) {
      console.error(err)
      res.status(500).send({
        error: 'The users information was incorrect',
      })
    }
  },

  // ===== (ของเดิม) create user =====
  // ⚠️ แนะนำ: ไม่ควรเปิดให้ใช้ทั่วไปแล้ว ให้สมัครผ่าน AuthController.register แทน
  async create(req, res) {
    try {
      const user = await User.create(req.body)
      const json = user.toJSON()
      delete json.password
      res.send(json)
    } catch (err) {
      console.error(err)
      res.status(500).send({
        error: 'Create user incorrect',
      })
    }
  },

  // ===== (ของเดิม) edit user =====
  async put(req, res) {
    try {
      await User.update(req.body, {
        where: { id: req.params.userId },
      })
      res.send(req.body)
    } catch (err) {
      console.error(err)
      res.status(500).send({
        error: 'Update user incorrect',
      })
    }
  },

  // ===== (ของเดิม) delete user =====
  async remove(req, res) {
    try {
      const user = await User.findOne({
        where: { id: req.params.userId },
      })

      if (!user) {
        return res.status(404).send({ error: 'User not found' })
      }

      await user.destroy()
      const json = user.toJSON()
      delete json.password
      res.send(json)
    } catch (err) {
      console.error(err)
      res.status(500).send({
        error: 'The user information was incorrect',
      })
    }
  },

  // ===== (ของเดิม) get user by id =====
  async show(req, res) {
    try {
      const user = await User.findByPk(req.params.userId, {
        attributes: { exclude: ['password'] },
      })
      res.send(user)
    } catch (err) {
      console.error(err)
      res.status(500).send({
        error: 'The user information was incorrect',
      })
    }
  },
}