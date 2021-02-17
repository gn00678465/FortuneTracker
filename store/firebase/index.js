export const state = () => ({
  currentSelectDate: undefined,
  currentDateRange: undefined,
  allCategories: undefined
})

export const getters = {
  // 取得 expense 相關分類
  expenseCategories (state) {
    const allCategories = state.allCategories
    if (!allCategories || !Object.prototype.hasOwnProperty.call(allCategories, 'expense')) {
      return []
    }
    return Object.values(state.allCategories.expense)
  },
  // 取得 income 相關分類
  incomeCategories (state) {
    const allCategories = state.allCategories
    if (!allCategories || !Object.prototype.hasOwnProperty.call(allCategories, 'income')) {
      return []
    }
    return Object.values(state.allCategories.income)
  }
}

export const mutations = {
  SET_CURRENTSELECTDATE: (state, payload) => {
    state.currentSelectDate = payload
  },
  SET_CURRENTDATERANGE: (state, payload) => {
    state.currentDateRange = payload
  },
  SET_ALLCATEROIES: (state, payload) => {
    state.allCategories = payload
  }
}

export const actions = {
  // 取得所有分類
  async getAllCategories ({ commit }) {
    const obj = {}
    const ref = this.$fire.firestore.collection('categories')
    await ref.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        obj[doc.id] = doc.data()
      })
    })
    commit('SET_ALLCATEROIES', obj)
  },
  // 新增資料去資料庫
  async setNewData ({ state, dispatch }, payload) {
    const ref = this.$fire.firestore.collection(process.env.collection)
    const date = this.$moment(state.currentSelectDate).unix()
    const id = Date.now().toString()
    await ref.doc(id).set({
      id,
      date,
      ...payload
    })
  },
  // 取得篩選資料
  async getRangeData ({ state }) {
    const ref = this.$fire.firestore.collection(process.env.collection)
    const start = this.$moment(state.currentDateRange[0]).unix()
    const end = this.$moment(state.currentDateRange[1]).unix()
    await ref.where('date', '>=', start).where('date', '<=', end).onSnapshot((docs) => {
      docs.forEach((doc) => {
        console.log(doc.data())
      })
    })
  }
}
