import Api from './Api'
export default {
  myCats() {
    return Api().get('my/cats')
  },
  create(cat) {
    return Api().post('my/cats', cat)
  },
  update(id, cat) {
    return Api().put('my/cats/' + id, cat)
  },
  delete(id) {
    return Api.delete("/my/cats/" + id)
  }
}