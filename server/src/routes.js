const AuthController = require('./controllers/AuthController')
const CatController = require('./controllers/CatController')
const RoomController = require('./controllers/RoomController')
const ReservationController = require('./controllers/ReservationController')
const UserController = require('./controllers/UserController')
const AnnouncementController = require('./controllers/AnnouncementController')
const UploadController = require('./controllers/UploadController')
const upload = require('./middleware/upload')
const { requireAuth, requireAdmin } = require('./middleware/auth')

module.exports = (app) => {
  // Health
  app.get('/status', (req, res) => res.send('CAT-Hotel-Reservation-System API OK'))

  // Auth
  app.post('/auth/register', AuthController.register)
  app.post('/auth/login', AuthController.login)
  app.get('/auth/me', requireAuth, AuthController.me)

  // Rooms (public/customer view)
  app.get('/rooms', RoomController.list)

  // Cats (customer)
  app.get('/my/cats', requireAuth, CatController.myCats)
  app.post('/my/cats', requireAuth, CatController.create)
  app.put('/my/cats/:id', requireAuth, CatController.update)

  // Reservations (customer)
  app.get('/my/reservations', requireAuth, ReservationController.my)
  app.post('/my/reservations', requireAuth, ReservationController.create)
  app.post('/my/reservations/:id/cancel', requireAuth, ReservationController.cancel)

  // ===== Admin =====
  app.get('/admin/customers', requireAuth, requireAdmin, UserController.customers)
  app.get('/admin/cats', requireAuth, requireAdmin, CatController.all)

  // admin rooms
  app.post('/admin/rooms', requireAuth, requireAdmin, RoomController.create)
  app.put('/admin/rooms/:id', requireAuth, requireAdmin, RoomController.update)
  app.delete('/admin/rooms/:id', requireAuth, requireAdmin, RoomController.remove)

  // admin reservations
  app.get('/admin/reservations', requireAuth, requireAdmin, ReservationController.all)
  app.post('/admin/reservations/:id/approve', requireAuth, requireAdmin, ReservationController.approve)
  app.post('/admin/reservations/:id/reject', requireAuth, requireAdmin, ReservationController.reject)
  app.post('/admin/reservations/:id/status', requireAuth, requireAdmin, ReservationController.setStatus)

  // public
  app.get('/announcements', AnnouncementController.list)
  app.get('/announcements/:id', AnnouncementController.show)

  // admin only
  app.post('/admin/announcements', requireAuth, requireAdmin, AnnouncementController.create)
  app.put('/admin/announcements/:id', requireAuth, requireAdmin, AnnouncementController.update)
  app.delete('/admin/announcements/:id', requireAuth, requireAdmin, AnnouncementController.remove)

  // upload image
  app.post('/upload',
    requireAuth,
    upload.single('image'),
    UploadController.upload
  )
}