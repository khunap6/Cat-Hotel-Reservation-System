const fs = require('fs')
const path = require('path')

module.exports = {
  upload (req, res) {
    // Controller ทำหน้าที่แค่ส่ง response เพราะ Middleware จัดการไฟล์เสร็จแล้ว
    if (!req.file) {
        return res.status(400).send({
          error: 'No file uploaded or invalid file type.' 
        })
    }

    // ส่งชื่อไฟล์กลับไปให้ Client เพื่อบันทึกลง DB ต่อไป
    res.json({
      filename: req.file.filename
    })
  },
  deleteFile (req, res) {
    try {
      const filename = req.body.filename
      const filepath = path.join(__dirname, '../../public/uploads/', filename)
      
      fs.unlink(filepath, (err) => {
        if (err) {
          console.error(err)
          return res.status(500).send({
            error: 'An error has occured trying to delete the file'
          })
        }
        res.send({
          status: 'success',
          message: 'File deleted successfully'
        })
      })
    } catch (err) {
      console.log(err)
      res.status(500).send({
        error: 'An error has occured trying to delete the file'
      })
    }
  }
}