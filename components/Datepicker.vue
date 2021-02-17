<template>
  <div>
    <div class="relative">
      <input
        :id="id"
        type="text"
        :value="value"
        class="text-white w-full bg-secondary border border-solid border-white rounded-md py-2 pl-10 pr-2
        focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50
          transition-all duration-300"
        @focus.self="show = true"
      >
      <span class="text-white material-icons absolute top-1/2 transform -translate-y-1/2 left-3">date_range</span>
    </div>
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <Calendar
        v-if="show"
        :show-dots="false"
        class="z-10 absolute left-2 right-2 border border-solid border-primary rounded-md mt-2 bg-secondary"
        @datepicker_close="show = false"
      />
    </transition>
    <div v-show="show" class="absolute top-0 bottom-0 left-0 right-0" @click.self="show = false" />
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  },
  data: () => ({
    show: false
  })
}
</script>
