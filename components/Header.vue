<template>
  <header ref="header" class="w-full text-center text-2xl font-medium py-3 text-white">
    {{ header }}
  </header>
</template>

<script>
export default {
  data: () => ({
    pathMap: {
      overview: '帳戶總覽',
      record: '新增記帳',
      analysis: '項目分析',
      setting: '設定'
    }
  }),
  computed: {
    header () {
      const path = this.$route.path.slice(1).split('/')
      return path.length === 1 ? '記帳日誌' : this.pathMap[path[1]]
    }
  }
}
</script>
