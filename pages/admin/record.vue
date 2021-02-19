<template>
  <div>
    <!-- 切換 -->
    <ul class="flex text-center border-2 border-solid border-primary rounded-lg divide-x-2 divide-primary mb-5">
      <li class="flex-grow">
        <button
          type="button"
          class="py-2 w-full cursor-pointer focus:outline-none font-medium"
          :class="formData.isExpense ? 'bg-primary text-black' : 'text-white'"
          data-expense="true"
          @click="changeTab"
        >
          支出
        </button>
      </li>
      <li class="flex-grow">
        <button
          type="button"
          class="py-2 w-full cursor-pointer focus:outline-none font-medium"
          :class="!formData.isExpense ? 'bg-primary text-black' : 'text-white'"
          data-expense="false"
          @click="changeTab"
        >
          收入
        </button>
      </li>
    </ul>
    <!-- 主要 form -->
    <div class="mb-4">
      <label class="block mb-1 text-white" for="price">金額</label>
      <input
        id="price"
        v-model.number="formData.price"
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
    <!-- expense 選擇分類 -->
    <template v-if="formData.isExpense">
      <div class="flex mb-4">
        <div class="flex-1 mr-3">
          <label class="block mb-1 text-white" for="category">分類</label>
          <select
            id="category"
            v-model="computeExpenseCategory"
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
            v-model="computeExpenseSubcategory"
            name="subcategory"
            class="text-white w-full bg-secondary border border-solid border-white rounded-md p-2"
          >
            <option v-for="subcategory of expenseSubcategories" :key="subcategory.id" :value="subcategory.id">
              {{ subcategory.name }}
            </option>
          </select>
        </div>
      </div>
    </template>
    <!-- income 選擇分類 -->
    <template v-else>
      <div class="flex-1 mb-4">
        <label class="block mb-1 text-white" for="category">分類</label>
        <select
          id="category"
          v-model.trim="computeIncomeCategory"
          name="category"
          class="text-white w-full bg-secondary border border-solid border-white rounded-md p-2"
        >
          <option v-for="category of incomeCategories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>
    </template>
    <!--  -->
    <div class="mb-4">
      <label class="block mb-1 text-white" for="store">商家</label>
      <input
        id="store"
        v-model="formData.store"
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
        v-model.trim="formData.notes"
        class="text-white w-full bg-secondary border border-solid border-white rounded-md p-2 transition-all duration-300
        focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
        type="text"
        name="notes"
        rows="5"
      />
    </div>
    <div class="flex">
      <button
        class="flex-1 border border-solid border-white py-2 rounded text-white mr-2 font-medium
        transition-colors duration-300 hover:bg-primary hover:border-primary hover:text-black focus:outline-none"
        @click.prevent="pushData"
      >
        <template v-if="!isEdit">
          新增資料
        </template>
        <template v-else>
          修改資料
        </template>
      </button>
      <button
        class="flex-1 border border-solid border-white py-2 rounded text-white font-medium
        transition-colors duration-300 hover:bg-white hover:text-black focus:outline-none"
        @click.prevent="resetForm(formData.isExpense)"
      >
        重置
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    formData: {
      isExpense: true,
      price: null,
      name: null,
      category: null,
      subcategory: null,
      notes: null,
      store: null,
      tags: []
    }
  }),
  async fetch ({ store }) {
    if (!store.state.firebase.allCategories) {
      await store.dispatch('firebase/getAllCategories')
    }
  },
  computed: {
    // URL 有 query 判斷為編輯中
    isEdit () {
      return ('id' in this.$route.params)
    },
    // 取得當前日期
    currentDate () {
      const currentSelectDate = this.$store.state.firebase.currentSelectDate
      return this.$moment(currentSelectDate).format('YYYY-MM-DD')
    },
    // 取得 expense 所有分類
    expenseCategories () {
      return this.$store.getters['firebase/expenseCategories']
    },
    // 取得 income 所有分類
    incomeCategories () {
      return this.$store.getters['firebase/incomeCategories']
    },
    // 取得 expense 選擇分類的子分類
    expenseSubcategories () {
      if (!this.formData.isExpense) {
        return []
      }
      if (this.expenseCategories.length === 0 || !this.formData.category) {
        return []
      }
      return this.expenseCategories.filter((category) => {
        return category.id === this.formData.category
      })[0].subcategories
    },
    // expense
    computeExpenseCategory: {
      get () {
        return this.formData.category
      },
      set (val) {
        this.formData.category = val
        this.formData.subcategory = this.expenseSubcategories[0].id
      }
    },
    computeExpenseSubcategory: {
      get () {
        return this.formData.subcategory
      },
      set (val) {
        this.formData.subcategory = val
      }
    },
    // income
    computeIncomeCategory: {
      get () {
        return this.formData.category
      },
      set (val) {
        this.formData.category = val
      }
    }
  },
  created () {
    if (this.isEdit) {
      this.$store.dispatch('firebase/getOneData', { id: this.$route.params.id }).then((data) => {
        this.formData = data
      })
    }
  },
  methods: {
    // 新增資料到 firebase
    pushData () {
      const { isExpense, price, category, subcategory } = this.formData
      if ((!price || !category) && (!isExpense || !subcategory)) {
        return
      }
      const actions = !this.isEdit ? 'firebase/setNewData' : 'firebase/updateData'
      const payload = {
        data: this.formData,
        id: this.$route.params.id || undefined
      }
      this.$store.dispatch(actions, payload).then(() => {
        this.resetForm()
        this.$router.push('/admin')
      })
    },
    // 重置表單
    resetForm (tab = true) {
      this.formData = {
        isExpense: tab,
        price: null,
        name: null,
        category: null,
        subcategory: null,
        notes: null,
        store: null,
        tags: []
      }
    },
    // 切換
    changeTab (e) {
      this.resetForm()
      this.formData.isExpense = e.target.dataset.expense === 'true'
    }
  }
}
</script>
