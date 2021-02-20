<template>
  <div>
    <!-- charts -->
    <ChartBar />
    <!-- datas -->
    <template v-if="sortByDate">
      <ListData v-for="(dataArr , key) of sortByDate" :key="key">
        <template #date>
          <span>{{ date2str(key) }} ( {{ dataArr.length }} )</span>
        </template>
        <template #data>
          <li v-for="data of dataArr" :key="data.id">
            <Card v-bind="data" />
          </li>
        </template>
      </ListData>
    </template>
  </div>
</template>

<script>
export default {
  computed: {
    // 依日期整理資料
    sortByDate () {
      return this.$store.getters['firebase/dataSortByDate'] || []
    }
  },
  methods: {
    // unixtime 轉字串格式
    date2str (date) {
      return this.$moment.unix(date).format('YYYY-MM-DD')
    },
    // data reduce
    dataReduce (arr) {
      if (arr.length === 0) {
        return 0
      }
      return arr.reduce((accu, curr) => {
        return curr.price + accu
      }, 0)
    },
    dataFilter (arr, isExpense) {
      return arr.filter((item) => {
        return item.isExpense === isExpense
      })
    }
  }
}
</script>
