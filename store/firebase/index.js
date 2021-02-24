export const state = () => ({
  currentSelectDate: undefined,
  currentDateRange: undefined,
  allCategories: undefined,
  allRangeData: undefined
})

export const getters = {
  // 取出 expense 相關分類
  expenseCategories (state) {
    const allCategories = state.allCategories
    if (!allCategories || !Object.prototype.hasOwnProperty.call(allCategories, 'expense')) {
      return []
    }
    return Object.values(state.allCategories.expense)
  },
  // 取出 income 相關分類
  incomeCategories (state) {
    const allCategories = state.allCategories
    if (!allCategories || !Object.prototype.hasOwnProperty.call(allCategories, 'income')) {
      return []
    }
    return Object.values(state.allCategories.income)
  },
  // 依日期分類並計算次數
  sortByDateAndCount (state) {
    if (!state.allRangeData) {
      return {}
    }
    return state.allRangeData.reduce((obj, item) => {
      if (!(item.date in obj)) {
        obj[item.date] = {
          expense: null,
          income: null
        }
        if (item.isExpense) {
          obj[item.date].expense += 1
        } else {
          obj[item.date].income += 1
        }
      }
      if (item.date in obj) {
        if (item.isExpense) {
          obj[item.date].expense += 1
        } else {
          obj[item.date].income += 1
        }
      }
      return obj
    }, {})
  },
  // 依日期整理資料
  dataSortByDate (state) {
    if (!state.allRangeData) {
      return undefined
    }
    return state.allRangeData.reduce((obj, item) => {
      const date = item.date
      if (!(date in obj)) {
        obj[date] = []
        obj[date].push(item)
      } else {
        obj[date].push(item)
      }
      return obj
    }, {})
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
  },
  SET_ALLRANGEDATA: (state, payload) => {
    state.allRangeData = payload
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
  async setNewData ({ state }, payload) {
    const ref = this.$fire.firestore.collection(process.env.collection)
    const date = this.$moment(state.currentSelectDate).unix()
    const id = Date.now().toString()
    await ref.doc(id).set({
      ...payload.data,
      date,
      id
    })
    return new Promise((resolve) => {
      resolve()
    })
  },
  // 修改資料並更新資料庫
  async updateData ({ state, dispatch }, payload) {
    const date = this.$moment(state.currentSelectDate).unix()
    await this.$fire.firestore.collection(process.env.collection).doc(payload.id).update({
      ...payload.data,
      date
    })
    dispatch('getRangeData')
    return new Promise((resolve, reject) => {
      resolve()
    })
  },
  // 刪除特定 document
  async deleteData ({ dispatch }, id) {
    await this.$fire.firestore.collection(process.env.collection).doc(id).delete()
    dispatch('getRangeData')
    return new Promise((resolve, reject) => {
      resolve()
    })
  },
  // 取得篩選資料
  async getRangeData ({ state, commit }) {
    const ref = this.$fire.firestore.collection(process.env.collection)
    const start = state.currentDateRange[0]
    const end = state.currentDateRange[1]
    const arr = []
    // await ref.where('date', '>=', start).where('date', '<', end).onSnapshot((docs) => {
    //   docs.forEach((doc) => {
    //     arr.push(doc.data())
    //   })
    // })
    await ref.where('date', '>=', start).where('date', '<', end).orderBy('date').get().then((snapshot) => {
      snapshot.forEach((doc) => {
        arr.push(doc.data())
      })
    })
    commit('SET_ALLRANGEDATA', arr)
  },
  // 取得單筆資料
  async getOneData ({ state }, payload) {
    const ref = this.$fire.firestore.collection(process.env.collection).doc(payload.id)
    const data = await ref.get().then((doc) => {
      return doc.data()
    })
    return new Promise((resolve) => {
      resolve(data)
    })
  }
}
