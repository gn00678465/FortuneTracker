<template>
  <div>
    <Calendar />
  </div>
</template>

<script>
export default {
  mounted () {
    this.$store.dispatch('firebase/getRangeData')
  }
}
</script>
