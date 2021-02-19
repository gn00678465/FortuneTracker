<template>
  <div>
    <Calendar />
    <OneDayData />
  </div>
</template>

<script>
export default {
  async fetch ({ store, params }) {
    const { years, months, date } = store.$moment().toObject()
    const isBefore = store.$moment({ years, months, date }).add(1, 'months').date(1).unix()
    const isAfter = store.$moment({ years, months, date }).date(1).unix()
    // 將今天日期寫入 store
    store.commit('firebase/SET_CURRENTSELECTDATE', { years, months, date })
    // 將本月頭尾寫入 store
    store.commit('firebase/SET_CURRENTDATERANGE', [isAfter, isBefore])
    // 取得區間資料
    await store.dispatch('firebase/getRangeData')
    // 取得所有分類
    if (!store.state.firebase.allCategories) {
      await store.dispatch('firebase/getAllCategories')
    }
  }
}
</script>
