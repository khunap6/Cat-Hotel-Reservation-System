import Api from './Api'
export default {
  my() {
    return Api().get('my/reservations')
  },
  create(payload) {
    return Api().post('my/reservations', payload)
  },
  cancel(id) {
    return Api().post(`my/reservations/${id}/cancel`)
  },

  // admin
  all() {
    return Api().get('admin/reservations')
  },
  approve(id, adminNote) {
    return Api().post(`admin/reservations/${id}/approve`, { adminNote })
  },
  reject(id, adminNote) {
    return Api().post(`admin/reservations/${id}/reject`, { adminNote })
  },
  setStatus(id, status, adminNote) {
    return Api().post(`admin/reservations/${id}/status`, { status, adminNote })
  }
}