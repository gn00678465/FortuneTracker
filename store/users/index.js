import Cookie from 'js-cookie'

export const state = () => ({
  user: null
})

export const mutations = {
  SET_USER: (state, payload) => {
    state.user = payload
  }
}

export const actions = {
  async login ({ commit }, account) {
    await this.$fire.auth.signInWithEmailAndPassword(account.email, account.password)
    try {
      // 取得當前登入者的 token(JWT)
      const token = await this.$fire.auth.currentUser.getIdToken()
      // 取得當前登入者的 email uid
      const { email, uid } = this.$fire.auth.currentUser
      // 將 token 寫入 cookie
      Cookie.set('access_token', token)
      // 將 email uid 記錄在 user
      commit('SET_USER', { email, uid })
    } catch (err) {
      return err
    }
  }
}
