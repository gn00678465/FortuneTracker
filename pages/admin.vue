<template>
  <div class="relative min-h-screen bg-secondary">
    <Header />
    <nuxt-child class="px-4 overflow-y-auto overflow-x-hidden main-height" />
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
  height: calc(100vh - 56px - 80px);
}

</style>
