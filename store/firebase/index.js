export const state = () => ({
  currentSelectDate: undefined,
  currentDateRange: undefined
})

export const mutations = {
  SET_CURRENTSELECTDATE: (state, payload) => {
    state.currentSelectDate = payload
  },
  SET_CURRENTDATERANGE: (state, payload) => {
    state.currentDateRange = payload
  }
}
