<template>
  <div>
    <!-- 月份切換 -->
    <div class="flex justify-between items-center text-white -mx-2">
      <button class="material-icons p-2 focus:outline-none active:outline-none" @click="changeMonth(false)">
        chevron_left
      </button>
      <p class="font-medium">
        {{ unixTime2str($store.state.firebase.currentDateRange[0]) }}
      </p>
      <button class="material-icons p-2 focus:outline-none active:outline-none" @click="changeMonth(true)">
        chevron_right
      </button>
    </div>
    <!-- tab -->
    <!-- chart -->
    <ChartPie />
  </div>
</template>

<script>
export default {
  methods: {
    changeMonth (fix) {
      const action = fix ? 'add' : 'subtract'
      const newRange = this.$store.state.firebase.currentDateRange.map((date) => {
        return this.$moment.unix(date)[action](1, 'months').unix()
      })
      // 將當月頭尾時間 commit 到 store
      this.$store.commit('firebase/SET_CURRENTDATERANGE', newRange)
      // 取得資料庫資料
      this.$store.dispatch('firebase/getRangeData')
    },
    unixTime2str (date) {
      return this.$moment.unix(date).format('YYYY-MM')
    }
  }
}
</script>
