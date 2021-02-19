<template>
  <div class="px-2">
    <p class="text-xl text-white flex justify-between font-medium items-center mb-2 cursor-pointer" @click="show = !show">
      <slot name="date" />
      <button
        class="material-icons focus:outline-none active:outline-none"
      >
        {{ !show ? 'add' : 'remove' }}
      </button>
    </p>
    <ul class="overflow-hidden transition-all duration-300" :class="show ? 'max-h-96' : 'max-h-0'">
      <slot name="data" />
    </ul>
  </div>
</template>

<script>
export default {
  data: () => ({
    show: true
  })
}
</script>
