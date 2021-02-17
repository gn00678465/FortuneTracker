<template>
  <div>
    <div class="mb-4">
      <label class="block mb-1 text-white" for="price">金額</label>
      <input
        id="price"
        v-model.number="expense.price"
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
    <div class="flex mb-4">
      <div class="flex-1 mr-3">
        <label class="block mb-1 text-white" for="category">分類</label>
        <select
          id="category"
          v-model="computeCategory"
          name="category"
          class="text-white w-full bg-secondary border border-solid border-white rounded-md p-2"
        >
          <option
            v-for="(category) of expenseCategories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>
      <div class="flex-1">
        <label class="block mb-1 text-white" for="subcategory">子分類</label>
        <select
          id="subcategory"
          v-model="computeSubcategory"
          name="subcategory"
          class="text-white w-full bg-secondary border border-solid border-white rounded-md p-2"
        >
          <option v-for="subcategory of expenseSubcategories" :key="subcategory.id" :value="subcategory.id">
            {{ subcategory.name }}
          </option>
        </select>
      </div>
    </div>
    <div class="mb-4">
      <label class="block mb-1 text-white" for="store">商家</label>
      <input
        id="store"
        v-model="expense.store"
        type="text"
        name="store"
        placeholder="請輸入商家名稱"
        class="text-white w-full bg-secondary border border-solid border-white rounded-md p-2 transition-all duration-300
        focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
      >
    </div>
    <div class="mb-4">
      <label class="block mb-1 text-white" for="notes">備註</label>
      <textarea
        id="notes"
        v-model.trim="expense.notes"
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
        @click.prevent="setNewExpense"
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
    expense: {
      isExpense: true,
      price: null,
      name: null,
      category: null,
      subcategory: null,
      notes: null,
      store: null,
      tags: []
    },
    isEdit: false
  }),
  computed: {
    // 取得當前日期
    currentDate () {
      const currentSelectDate = this.$store.state.firebase.currentSelectDate
      return this.$moment(currentSelectDate).format('YYYY-MM-DD')
    },
    // 取得 expense 所有分類
    expenseCategories () {
      return this.$store.getters['firebase/expenseCategories']
    },
    // 取得目前選擇分類的子分類
    expenseSubcategories () {
      if (this.expenseCategories.length === 0 || !this.expense.category) {
        return []
      }
      return this.expenseCategories.filter((category) => {
        return category.id === this.expense.category
      })[0].subcategories
    },
    computeCategory: {
      get () {
        return this.expense.category
      },
      set (val) {
        this.expense.category = val
        this.expense.subcategory = this.expenseSubcategories[0].id
      }
    },
    computeSubcategory: {
      get () {
        return this.expense.subcategory
      },
      set (val) {
        this.expense.subcategory = val
      }
    }
  },
  methods: {
    // 新增資料到 firebase
    setNewExpense () {
      const { price, category, subcategory } = this.expense
      if (!price || !category || !subcategory) {
        return false
      }
      this.$store.dispatch('firebase/setNewData', this.expense)
    },
    // 重置表單
    resetForm () {
      this.expense = {
        isExpense: true,
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
