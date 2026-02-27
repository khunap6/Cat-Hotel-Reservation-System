import Api from './Api'

export default {
  register(payload) {
    return Api().post('auth/register', payload)
  },
  login(payload) {
    return Api().post('auth/login', payload)
  },
  me() {
    return Api().get('auth/me')
  },
}