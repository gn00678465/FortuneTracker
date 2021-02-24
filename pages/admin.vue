<template>
  <div class="relative h-full pt-14 bg-secondary">
    <Header />
    <nuxt-child class="px-4 mt-1 overflow-y-auto overflow-x-hidden main-height" />
    <Footer />
  </div>
</template>

<script>
export default {
  name: 'Admin'
}
</script>

<style>
.main-height {
  height: calc(100% - 80px);
}

</style>
