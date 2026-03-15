const express = require('express')
const cors = require('cors')

const { sequelize, User, Room, Cat, Reservation, Announcement } = require('./models')
const config = require('./config/config')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

require('./userPassport')
const passport = require('passport')
app.use(passport.initialize())

app.use('/assets', express.static('public'))
require('./routes')(app)

// ─────────────────────────────────────────────
// SEED DATA
// ─────────────────────────────────────────────
async function seed() {

  // ── Admin ──────────────────────────────────
  const adminEmail = 'admin@cat-hotel.com'
  let admin = await User.findOne({ where: { email: adminEmail } })
  if (!admin) {
    admin = await User.create({
      email: adminEmail, password: 'admin1234',
      name: 'ผู้ดูแลระบบ', role: 'admin',
    })
    console.log('✅ Seed admin => admin@cat-hotel.com / admin1234')
  }

  // ── Demo customers ─────────────────────────
  const customerSeeds = [
    { email: 'sarah@example.com', password: 'demo1234', name: 'Sarah Jenkins',    phone: '081-234-5678' },
    { email: 'james@example.com', password: 'demo1234', name: 'James Carter',     phone: '082-345-6789' },
    { email: 'emily@example.com', password: 'demo1234', name: 'Emily Thompson',   phone: '083-456-7890' },
  ]
  const customers = []
  for (const c of customerSeeds) {
    let u = await User.findOne({ where: { email: c.email } })
    if (!u) u = await User.create({ ...c, role: 'customer' })
    customers.push(u)
  }
  console.log('✅ Seed customers ready')

  // ── Rooms ──────────────────────────────────
  const roomCount = await Room.count()
  let rooms = []
  if (roomCount === 0) {
    rooms = await Room.bulkCreate([
      {
        name: 'Standard Suite A', type: 'Standard',
        pricePerNight: 350, capacityCats: 1, status: 'available',
        imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
        description: 'ห้องพักสะดวกสบายสำหรับแมว 1 ตัว มีหน้าต่างชมสวน ที่นอนนุ่ม และของเล่นให้เลือกเล่น เหมาะสำหรับแมวที่ชอบความเงียบสงบ',
      },
      {
        name: 'Standard Suite B', type: 'Standard',
        pricePerNight: 350, capacityCats: 1, status: 'available',
        imageUrl: 'https://images.unsplash.com/photo-1587985064135-0366536eab42?w=800&q=80',
        description: 'ห้องพักมาตรฐานพร้อมมุมพักผ่อนส่วนตัว มีที่ฝนเล็บและชั้นวางสำหรับปีนป่าย อาหารและน้ำสะอาดให้ตลอดวัน',
      },
      {
        name: 'Deluxe Suite C', type: 'Deluxe',
        pricePerNight: 550, capacityCats: 1, status: 'available',
        imageUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&q=80',
        description: 'ห้องพักแบบ Deluxe กว้างขวางกว่า มีชั้นปีนหลายระดับ ที่นอนออร์โธพีดิกนุ่มสบาย และเซสชั่นเล่นขนนกรายวัน เหมาะสำหรับแมวช่างซน',
      },
      {
        name: 'Deluxe Suite D', type: 'Deluxe',
        pricePerNight: 550, capacityCats: 2, status: 'available',
        imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=80',
        description: 'ห้อง Deluxe คู่ รองรับ 2 ตัว มีพื้นที่กว้างขวาง ต้นไม้ประดับ และหน้าต่างทรงโค้งรับแสงธรรมชาติ พร้อมบริการ grooming รายวัน',
      },
      {
        name: 'VIP Penthouse', type: 'VIP',
        pricePerNight: 900, capacityCats: 2, status: 'available',
        imageUrl: 'https://images.unsplash.com/photo-1631049552057-403cdb8f0658?w=800&q=80',
        description: 'ห้อง VIP สุดหรู มีกล้องเว็บแคม 24 ชม. ให้เจ้าของดูได้ตลอดเวลา บัตเลอร์ส่วนตัว อาหาร Gourmet ระดับพรีเมียม และระเบียงส่วนตัว เหมาะสำหรับเจ้านายขนฟูที่สมควรได้ของที่ดีที่สุด',
      },
      {
        name: 'Royal Suite', type: 'Suite',
        pricePerNight: 1200, capacityCats: 3, status: 'available',
        imageUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80',
        description: 'Royal Suite ที่สุดแห่งความหรูหรา รองรับได้ถึง 3 ตัว มีพื้นที่นั่งเล่นแยก ห้องน้ำส่วนตัว สระน้ำลูกแมว และ butler สุดเซอร์วิส เหมาะสำหรับกลุ่มแมวที่อยากมาพักร่วมกัน',
      },
      {
        name: 'Garden View Room', type: 'Standard',
        pricePerNight: 380, capacityCats: 1, status: 'maintenance',
        imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80',
        description: 'ห้องพักวิวสวน หน้าต่างกว้างชมนกและผีเสื้อ บรรยากาศผ่อนคลาย ขณะนี้อยู่ระหว่างปรับปรุง',
      },
    ])
    console.log('✅ Seed 7 rooms created')
  } else {
    rooms = await Room.findAll()
  }

  // ── Cats ───────────────────────────────────
  const catCount = await Cat.count()
  let cats = []
  if (catCount === 0) {
    const catSeeds = [
      { userId: customers[0].id, name: 'Luna', breed: 'Scottish Fold', gender: 'female', age: 3, weight: 3.5, imageUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1912da?w=400&q=80', note: 'ชอบกอดนุ่มๆ ไม่ชอบเสียงดัง' },
      { userId: customers[0].id, name: 'Oliver', breed: 'Orange Tabby', gender: 'male', age: 5, weight: 5.2, imageUrl: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&q=80', note: 'กินดีนอนหลับ ชอบเล่นขนนก' },
      { userId: customers[1].id, name: 'Whiskers', breed: 'Persian', gender: 'male', age: 4, weight: 4.8, imageUrl: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&q=80', note: 'ขนยาวต้องหวีทุกวัน' },
      { userId: customers[1].id, name: 'Mochi', breed: 'Munchkin', gender: 'female', age: 2, weight: 2.9, imageUrl: 'https://cdn.ennxo.com/uploads/products/320/e2f12c11eafd4d4ea0e4d95c62edd3b2.jpg', note: 'ขาสั้นน่ารัก ชอบนอนตักเจ้าของ' },
      { userId: customers[2].id, name: 'Simba', breed: 'Maine Coon', gender: 'male', age: 6, weight: 7.1, imageUrl: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?w=400&q=80', note: 'ตัวใหญ่แต่ใจดี ชอบน้ำ' },
      { userId: customers[2].id, name: 'Bella', breed: 'Siamese', gender: 'female', age: 3, weight: 3.2, imageUrl: 'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=400&q=80', note: 'ร้องเก่ง ชอบคุย ต้องการความสนใจ' },
    ]
    cats = await Cat.bulkCreate(catSeeds)
    console.log('✅ Seed 6 cats created')
  } else {
    cats = await Cat.findAll()
  }

  // ── Reservations ───────────────────────────
  const resCount = await Reservation.count()
  if (resCount === 0 && cats.length >= 5 && rooms.length >= 5) {
    const today = new Date()
    const d = (offset) => {
      const dt = new Date(today)
      dt.setDate(dt.getDate() + offset)
      return dt.toISOString().split('T')[0]
    }

    await Reservation.bulkCreate([
      // checked_in — กำลังพักอยู่
      { userId: customers[1].id, catId: cats[2].id, roomId: rooms[0].id, checkIn: d(-2), checkOut: d(3), status: 'checked_in', customerNote: 'โปรดหวีขนทุกเช้า', adminNote: 'Check-in เรียบร้อย' },
      // approved — รอเช็คอินวันนี้/พรุ่งนี้
      { userId: customers[0].id, catId: cats[0].id, roomId: rooms[4].id, checkIn: d(1), checkOut: d(4), status: 'approved', customerNote: 'แมวกลัวเสียงดัง โปรดระวัง' },
      // pending — รอ admin อนุมัติ
      { userId: customers[2].id, catId: cats[4].id, roomId: rooms[2].id, checkIn: d(3), checkOut: d(7), status: 'pending', customerNote: 'ต้องการอาหาร grain-free' },
      { userId: customers[1].id, catId: cats[3].id, roomId: rooms[3].id, checkIn: d(5), checkOut: d(8), status: 'pending' },
      // completed — จบแล้ว
      { userId: customers[0].id, catId: cats[1].id, roomId: rooms[1].id, checkIn: d(-14), checkOut: d(-10), status: 'completed', customerNote: '', adminNote: 'บริการครบถ้วน' },
      { userId: customers[2].id, catId: cats[5].id, roomId: rooms[5].id, checkIn: d(-30), checkOut: d(-25), status: 'completed' },
      // cancelled
      { userId: customers[0].id, catId: cats[0].id, roomId: rooms[2].id, checkIn: d(-7), checkOut: d(-5), status: 'cancelled', customerNote: 'ขอยกเลิก ติดธุระ' },
    ])
    console.log('✅ Seed 7 reservations created')
  }

  // ── Announcements ─────────────────────────
  const annCount = await Announcement.count()
  if (annCount === 0) {
    await Announcement.bulkCreate([
      {
        title: '🎉 โปรโมชั่นพิเศษ! จองล่วงหน้า 7 วัน ลด 15%',
        content: 'จองห้องพักล่วงหน้าอย่างน้อย 7 วัน รับส่วนลดทันที 15% สำหรับทุกประเภทห้อง ตั้งแต่วันนี้ถึงสิ้นเดือน ไม่จำกัดจำนวนครั้ง',
        type: 'promotion', isActive: true,
      },
      {
        title: '📢 เปิดตัวบริการ Royal Grooming Package ใหม่!',
        content: 'The Cat Hotel ภูมิใจเสนอบริการ Royal Grooming Package ครบวงจร ประกอบด้วย อาบน้ำ ตัดขน ตัดเล็บ และนวดผ่อนคลาย ราคาพิเศษเพียง ฿299 ต่อครั้ง สามารถเพิ่มเติมพร้อมการจองห้องพักได้เลย',
        type: 'news', isActive: true,
      },
      {
        title: '⚠️ แจ้งปิดปรับปรุง Garden View Room ชั่วคราว',
        content: 'ขออภัยในความไม่สะดวก ห้อง Garden View Room อยู่ระหว่างการปรับปรุงเพื่อยกระดับสิ่งอำนวยความสะดวก คาดว่าจะเปิดให้บริการอีกครั้งในอีก 2 สัปดาห์',
        type: 'alert', isActive: true,
      },
      {
        title: '🐱 เคล็ดลับดูแลแมวในหน้าร้อน',
        content: 'อากาศร้อนนี้ ควรดูแลแมวของคุณอย่างไร? 1. ให้น้ำสะอาดตลอดวัน 2. หลีกเลี่ยงการพาออกนอกบ้านช่วงบ่าย 3. เปิดแอร์ในระดับที่เหมาะสม 4. สังเกตอาการ heat stroke ที่ต้องระวัง',
        type: 'news', isActive: true,
      },
      {
        title: '🎊 ครบรอบ 3 ปี The Cat Hotel — ขอบคุณลูกค้าทุกท่าน!',
        content: 'เนื่องในโอกาสครบรอบ 3 ปีของเรา ขอขอบคุณเจ้าของแมวทุกท่านที่ไว้วางใจ The Cat Hotel ดูแลสมาชิกขนฟูของคุณ เราจะพัฒนาบริการให้ดียิ่งขึ้นเรื่อยๆ',
        type: 'promotion', isActive: true,
      },
    ])
    console.log('✅ Seed 5 announcements created')
  }

}

// migrate imageUrl column ถ้ายังไม่มี (safe สำหรับ SQLite)
async function migrateColumns() {
  try {
    await sequelize.query('ALTER TABLE rooms ADD COLUMN imageUrl VARCHAR(255)')
    console.log('migrated: rooms.imageUrl added')
  } catch(e) {
    // column มีอยู่แล้ว ข้ามได้เลย
  }
}

sequelize
  .sync({ force: false })
  .then(async () => {
    await migrateColumns()
    await seed()
    app.listen(config.port, () => {
      console.log(`CAT-Hotel API running at http://localhost:${config.port}`)
    })
  })
  .catch((err) => console.error('DB sync error:', err))

module.exports = app
