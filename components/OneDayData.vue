<template>
  <ul class="py-3">
    <li v-for="data of filterDatas" :key="data.id">
      <Card v-bind="data" />
    </li>
  </ul>
</template>

<script>
export default {
  computed: {
    filterDatas () {
      const selectDate = this.$store.state.firebase.currentSelectDate
      const allData = this.$store.state.firebase.allRangeData
      return allData.filter((data) => {
        return data.date === this.$moment(selectDate).unix()
      })
    }
  }
}
</script>
