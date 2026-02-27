import Api from './Api'
export default {
  list() {
    return Api().get('rooms')
  },
  // admin
  create(room) {
    return Api().post('admin/rooms', room)
  },
  update(id, room) {
    return Api().put('admin/rooms/' + id, room)
  },
  remove(id) {
    return Api().delete('admin/rooms/' + id)
  }
}