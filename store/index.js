/* eslint-disable curly */
/* eslint-disable camelcase */
import cookieparser from 'cookieparser'
import JWTDecode from 'jwt-decode'

export const actions = {
  nuxtServerInit ({ commit }, { req }) {
    if (process.server && process.static) return
    if (!req.headers.cookie) return
    const cookieparsed = cookieparser.parse(req.headers.cookie)
    const accessToken = cookieparsed.access_token
    if (!accessToken) return
    const { email, user_id } = JWTDecode(accessToken)
    commit('users/SET_USER', {
      email,
      uid: user_id
    })
  }
}
