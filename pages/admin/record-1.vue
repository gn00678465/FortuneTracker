<template>
  <div>
    <!-- 切換 -->
    <ul class="flex text-center border-2 border-solid border-primary rounded-lg divide-x-2 divide-primary mb-5">
      <li class="flex-grow">
        <button
          type="button"
          class="py-2 w-full cursor-pointer focus:outline-none font-medium"
          data-tab="expense"
          :class="tab === 'expense' ? 'bg-primary text-black' : 'text-white'"
          @click="changeTab"
        >
          支出
        </button>
      </li>
      <li class="flex-grow">
        <button
          type="button"
          class="py-2 w-full cursor-pointer focus:outline-none font-medium"
          data-tab="income"
          :class="tab === 'income' ? 'bg-primary text-black' : 'text-white'"
          @click="changeTab"
        >
          收入
        </button>
      </li>
    </ul>
    <!-- 主要 form -->
    <component :is="componentIs" v-bind="isEdit" />
  </div>
</template>

<script>
export default {
  components: {
    expense: () => import('@/components/Expense.vue'),
    income: () => import('@/components/Income.vue')
  },
  data: () => ({
    tab: 'expense'
  }),
  computed: {
    componentIs () {
      return this.tab
    },
    isEdit () {
      return ('id' in this.$route.query)
    }
  },
  methods: {
    changeTab (e) {
      this.tab = e.target.dataset.tab
    }
  }
}
</script>
