import Api from "./Api"

export default {

  list() {
    return Api().get("announcements")
  },

  show(id) {
    return Api().get("announcements/" + id)
  },

  create(data) {
    return Api().post("admin/announcements", data)
  },

  update(id, data) {
    return Api().put("admin/announcements/" + id, data)
  },

  delete(id) {
    return Api().delete("admin/announcements/" + id)
  }

}