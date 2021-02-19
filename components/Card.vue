<template>
  <div>
    <a href="#" class="bg-dark mb-2 p-3 flex rounded-md" @click.prevent="showDialog = true">
      <p class="px-4 py-3 bg-primary flex-initial">
        <span class="material-icons text-4xl text-secondary">{{ isExpense ? iconMap[category] : 'attach_money' }}</span>
      </p>
      <ul class="ml-3 flex-1">
        <li class="text-xl flex justify-between font-medium">
          <p class="text-primary">{{ computedSubcategories }}</p>
          <p :class="!isExpense ? 'text-income' : 'text-expense'">${{ currency(price) }}</p>
        </li>
        <li class="text-white">
          {{ computedCategories }} - {{ computedSubcategories }}
        </li>
      </ul>
    </a>
    <DetailDialog
      :show.sync="showDialog"
      :tags="tags"
      v-bind="$attrs"
    >
      <template #icon>
        <span class="material-icons text-5xl text-primary">{{ isExpense ? iconMap[category] : 'attach_money' }}</span>
      </template>
      <template #category>
        <p class="text-secondary text-xl font-medium">
          {{ computedCategories }}/{{ computedSubcategories }}
        </p>
      </template>
      <template #detial>
        <p class="flex justify-between font-medium text-xl">
          <span class="text-primary">{{ computedSubcategories }}</span>
          <span :class="!isExpense ? 'text-income' : 'text-expense'">${{ currency(price) }}</span>
        </p>
      </template>
    </DetailDialog>
  </div>
</template>

<script>
export default {
  props: {
    category: {
      type: String,
      required: true
    },
    subcategory: {
      type: String
    },
    price: {
      type: [String, Number],
      required: true
    },
    isExpense: {
      type: Boolean,
      required: true
    },
    tags: {
      type: Array
    }
  },
  data: () => ({
    iconMap: {
      food: 'restaurant',
      interest: 'attach_money',
      traffic: 'traffic',
      life: 'satellite',
      medical: 'local_hospital',
      learning: 'menu_book',
      shopping: 'local_mall',
      home: 'home',
      recreation: 'movie',
      investment: 'account_balance_wallet'
    },
    showDialog: false
  }),
  computed: {
    expenseCategories () {
      return this.$store.getters['firebase/expenseCategories']
    },
    icomeCategories () {
      return this.$store.getters['firebase/incomeCategories']
    },
    categoriesData () {
      return !!this.expenseCategories && !!this.icomeCategories
    },
    computedCategories () {
      if (!this.categoriesData) {
        return ''
      }
      if (this.isExpense) {
        return this.filterFunction(this.expenseCategories, this.category).name
      } else {
        return '收入'
      }
    },
    computedSubcategories () {
      if (!this.categoriesData) {
        return ''
      }
      if (this.isExpense) {
        const subcategories = this.filterFunction(this.expenseCategories, this.category).subcategories
        return this.filterFunction(subcategories, this.subcategory).name
      } else {
        return this.filterFunction(this.icomeCategories, this.category).name
      }
    }
  },
  methods: {
    filterFunction (arr, condition) {
      return arr.filter((item) => {
        return item.id === condition
      })[0]
    },
    // 數值轉換成貨幣格式（千分位）
    currency (value) {
      let result = value.toString()
      const reg = /(-?\d+)(\d{3})/
      while (reg.test(result)) {
        result = result.replace(reg, '$1,$2')
      }
      return result
    }
  }
}
</script>
