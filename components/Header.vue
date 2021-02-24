<template>
  <header ref="header" class="fixed top-0 container text-center text-2xl font-medium py-3 text-white bg-secondary z-10">
    {{ header }}
  </header>
</template>

<script>
export default {
  computed: {
    header () {
      return this.$route.params.name || '記帳日誌'
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 480px;
  width: 100%;
}
</style>
