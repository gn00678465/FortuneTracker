<template>
  <div>
    <!-- select -->
    <ul class="flex mb-4">
      <li class="flex-grow text-right">
        <label
          for="expense"
          :class="radio === 'expense' ? 'bg-primary text-black' : 'text-white cursor-pointer'"
          class="inline-block w-3/4 py-1 px-3 border border-solid border-primary rounded-l-full text-center"
        >支出圓餅圖</label>
        <input id="expense" v-model="radio" value="expense" class="hidden" type="radio">
      </li>
      <li class="flex-grow">
        <label
          for="income"
          :class="radio === 'income' ? 'bg-primary text-black' : 'text-white cursor-pointer'"
          class="inline-block w-3/4 py-1 px-3 border border-solid border-primary rounded-r-full text-center"
        >收入圓餅圖</label>
        <input id="income" v-model="radio" value="income" class="hidden" type="radio">
      </li>
    </ul>
    <!-- 主分類選擇 -->
    <div v-if="radio === 'expense'" class="text-center mb-2">
      <select id="category" v-model="category" class="w-4/5 bg-secondary p-2 text-white border border-solid border-white rounded-md">
        <option v-for="item of expenseCategories" :key="item.id" :value="item.id">
          {{ item.name }}
        </option>
      </select>
    </div>
    <!-- pie chart -->
    <client-only>
      <Apexchart :key="Date.now()" type="pie" width="380" :options="chartOptions" :series="chartSeries" />
    </client-only>
    <!-- sum & list -->
    <p class="text-primary flex justify-between items-center text-2xl mb-2">
      <span>總計：</span>
      <span>TWD ${{ toCurrency(sum) }}</span>
    </p>
    <ul v-if="radio === 'expense'">
      <li v-for="(value, key) of expenseSort" :key="key" class="text-white text-xl text-right mb-1">
        <span>{{ key }}</span><span class="w-1/3 inline-block">{{ toCurrency(value) }}</span>
      </li>
    </ul>
    <ul v-else>
      <li v-for="(value, key) of incomeSort" :key="key" class="text-white text-xl text-right mb-1">
        <span>{{ key }}</span><span class="w-1/3 inline-block">{{ toCurrency(value) }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { TO_CURRENCY } from '~/plugins/mixin'

export default {
  data: () => ({
    radio: 'expense',
    category: 'food'
  }),
  computed: {
    // 分類資料
    expenseCategories () {
      return this.$store.getters['firebase/expenseCategories']
    },
    expenseSubcategories () {
      if (!this.expenseCategories) {
        return []
      }
      return this.expenseCategories.filter((item) => {
        return item.id === this.category
      })[0].subcategories
    },
    icomeCategories () {
      return this.$store.getters['firebase/incomeCategories']
    },
    // 區間的原始資料
    originalData () {
      return this.$store.state.firebase.allRangeData || []
    },
    // 圖表資料
    chartSeries () {
      return Object.values(this[`${this.radio}Sort`])
    },
    // expense 資料整理
    expenseSort () {
      return this.originalData.filter((data) => {
        return data.isExpense && data.category === this.category
      }).reduce((obj, item) => {
        const name = this.nameMap(this.expenseSubcategories, item.subcategory)
        if (!(name in obj)) {
          obj[name] = item.price
        } else {
          obj[name] += item.price
        }
        return obj
      }, {})
    },
    // income 資料整理
    incomeSort () {
      return this.originalData.filter((data) => {
        return !data.isExpense
      }).reduce((obj, item) => {
        const name = this.nameMap(this.icomeCategories, item.category)
        if (!(name in obj)) {
          obj[name] = item.price
        } else {
          obj[name] += item.price
        }
        return obj
      }, {})
    },
    // expense 總和
    sum () {
      return this.chartSeries.reduce((accu, curr) => {
        return accu + curr
      }, 0)
    },
    // 圖表參數
    chartOptions () {
      const labels = Object.keys(this[`${this.radio}Sort`])
      if (labels.length === 0) {
        return {
          noData: {
            text: '無相關資料',
            style: {
              color: '#fff',
              fontSize: '24px'
            }
          }
        }
      }
      return {
        chart: {
          width: 380,
          type: 'pie'
        },
        labels,
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }],
        legend: {
          labels: {
            colors: '#fff'
          }
        }
      }
    }
  },
  methods: {
    nameMap (arr, key) {
      if (arr.length === 0) {
        return
      }
      return arr.filter((item) => {
        return item.id === key
      })[0].name
    },
    toCurrency (num) {
      return TO_CURRENCY(num)
    }
  }
}
</script>
