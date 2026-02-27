import Api from './Api'

export default {
  upload (formData) {
    // ส่ง header 'multipart/form-data' เพื่อบอก Server ว่าเป็นการส่งไฟล์
    return Api().post('upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  delete (filename) {
    return Api().post('upload/delete', { filename: filename })
  }
}