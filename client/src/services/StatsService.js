import Api from './Api'
export default {
  dashboard() {
    return Api().get('admin/stats')
  }
}
