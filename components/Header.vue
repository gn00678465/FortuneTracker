<template>
  <header ref="header" class="w-full text-center text-2xl font-medium py-3 text-white">
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
