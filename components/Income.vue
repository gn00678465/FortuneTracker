<template>
  <div>
    <div class="mb-4">
      <label class="block mb-1 text-white" for="price">金額</label>
      <input
        id="price"
        v-model.number="income.price"
        v-input-filter:price
        class="text-white text-2xl text-right w-full bg-secondary border border-solid border-white rounded-md p-2 transition-all duration-300
        focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
        type="number"
        name="price"
        placeholder="0"
      >
    </div>
    <div class="mb-4">
      <label class="block mb-1 text-white" for="date">日期</label>
      <Datepicker id="datePicker" :value="currentDate" />
    </div>
    <div class="flex-1 mb-4">
      <label class="block mb-1 text-white" for="category">分類</label>
      <select
        id="category"
        v-model.trim="computeCategory"
        name="category"
        class="text-white w-full bg-secondary border border-solid border-white rounded-md p-2"
      >
        <option v-for="category of incomeCategories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
    </div>
    <div class="mb-4">
      <label class="block mb-1 text-white" for="notes">備註</label>
      <textarea
        id="notes"
        v-model.trim="income.notes"
        class="text-white w-full bg-secondary border border-solid border-white rounded-md p-2 transition-all duration-300
      focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
        type="text"
        name="notes"
        rows="5"
      />
    </div>
    <div class="flex">
      <button
        class="flex-1 border border-solid border-white py-2 rounded text-white mr-2
        transition-colors duration-300 hover:bg-white hover:text-black"
        @click.prevent="setNewIncome"
      >
        送出
      </button>
      <button
        class="flex-1 border border-solid border-white py-2 rounded text-white
        transition-colors duration-300 hover:bg-white hover:text-black"
        @click.prevent="resetForm"
      >
        重置
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    income: {
      isExpense: false,
      price: null,
      name: null,
      category: 'income',
      subcategory: null,
      notes: null,
      store: null,
      tags: []
    },
    isEdit: false,
    categories: [],
    subcategories: {}
  }),
  computed: {
    // 取得當前日期
    currentDate () {
      const currentSelectDate = this.$store.state.firebase.currentSelectDate
      return this.$moment(currentSelectDate).format('YYYY-MM-DD')
    },
    // 取得 income 所有分類
    incomeCategories () {
      return this.$store.getters['firebase/incomeCategories']
    },
    computeCategory: {
      get () {
        return this.income.category
      },
      set (val) {
        this.income.category = val
      }
    }
  },
  methods: {
    // 新增資料到 firebase
    setNewIncome () {
      const { price, category } = this.income
      if (!price || !category) {
        return false
      }
      this.$store.dispatch('firebase/setNewData', this.income)
    },
    // 重置表單
    resetForm () {
      this.income = {
        isExpense: false,
        price: null,
        name: null,
        category: null,
        subcategory: null,
        notes: null,
        store: null,
        tags: []
      }
    }
  }
}
</script>
