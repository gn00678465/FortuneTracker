<template>
  <div class="bg-secondary">
    <div class="bg-primary flex justify-between items-center rounded font-medium text-xl">
      <button class="material-icons py-3 rounded-l px-2 focus:outline-none" @click="changeMonth(false)">
        chevron_left
      </button>
      <p>{{ $moment(currentDate).format('YYYY 年 MM 月') }}</p>
      <button class="material-icons py-3 rounded-r px-2 focus:outline-none" @click="changeMonth(true)">
        chevron_right
      </button>
    </div>
    <ul class="text-center text-white grid grid-cols-7 gap-x-2">
      <li v-for="weekDay of weekDate" :key="weekDay" class="py-2">
        {{ weekDay }}
      </li>
    </ul>
    <ul class="text-center text-white flex-wrap grid grid-cols-7 gap-x-2 gap-y-1">
      <li v-for="date of mixCalendar" :key="`${date.months}-${date.date}`">
        <button
          type="button"
          class="w-full pt-1.5 pb-2.5 text-md relative"
          :class="classes[setClass(date)]"
          :disabled="setClass(date) === 'out-of-month'"
          @click="selectCurrentDate(date)"
        >
          <p>{{ 10 > date.date ? `0${date.date}` : date.date }}</p>
          <p v-show="showDots && setClass(date) !== 'out-of-month'">
            <span v-show="date.expense" class="absolute bottom-1 left-1/3 w-1.5 h-1.5 rounded-full bg-expense" />
            <span v-show="date.income" class="absolute bottom-1 right-1/3 w-1.5 h-1.5 rounded-full bg-income" />
          </p>
        </button>
      </li>
    </ul>
    <div class="flex justify-between items-center">
      <p v-show="showDots" class="text-white ml-3 mr-2">
        <span class="w-1.5 h-1.5 bg-expense rounded-full inline-block align-middle mr-1" />
        支出
      </p>
      <p v-show="showDots" class="text-white">
        <span class="w-1.5 h-1.5 rounded-full bg-income inline-block align-middle mr-1" />
        收入
      </p>
      <button type="button" class="focus:outline-none ative:outline-none text-primary ml-auto mr-3 mb-1" @click="setToday">
        <span class="material-icons align-bottom">home</span>
        <span>回到今天</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showDots: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    weekDate: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    today: undefined,
    currentDate: undefined,
    selectDate: undefined,
    classes: {
      select: 'font-bold bg-primary text-secondary rounded focus:outline-none',
      today: 'font-bold text-primary',
      'out-of-month': 'text-white text-opacity-25 cursor-auto'
    }
  }),
  computed: {
    // 產生月曆 Arr
    makeCalendar () {
      const firstDay = this.$moment(this.currentDate).date(1).day()
      const arr = []
      for (let i = 0; i < 42; i++) {
        const date = this.$moment(this.currentDate).date(1).subtract(firstDay, 'days').add(i, 'days')
        arr.push(this.date2Obj(date))
      }
      return arr
    },
    // 與數量合併
    mixCalendar () {
      const mixData = this.$store.getters['firebase/sortByDateAndCount']
      return this.makeCalendar.map((date) => {
        const unixTime = this.$moment(date).unix()
        if (unixTime in mixData) {
          return {
            ...date,
            ...mixData[unixTime]
          }
        } else {
          return {
            ...date,
            expense: null,
            income: null
          }
        }
      })
    },
    // 當前顯示月份下一個月第一天
    isBefore () {
      return this.$moment(this.currentDate).add(1, 'months').date(1)
    },
    // 當前顯示月份第一天
    isAfter () {
      return this.$moment(this.currentDate).date(1)
    },
    // date range
    dateRange: {
      get () {
        return [
          this.date2unix(this.isAfter),
          this.date2unix(this.isBefore)
        ]
      }
    }
  },
  async created () {
    this.today = this.$store.state.firebase.currentSelectDate
    if (this.$route.path.match('/admin/record')) {
      this.selectDate = this.currentDate = this.$store.state.firebase.currentSelectDate || this.date2Obj()
    } else {
      this.selectDate = this.currentDate = this.today
    }
    // 將今天日期寫入 store
    this.commitStore('firebase/SET_CURRENTSELECTDATE', this.today)
    // 將本月頭尾寫入 store
    this.commitStore('firebase/SET_CURRENTDATERANGE', this.dateRange)
    // 取得區間資料
    await this.$store.dispatch('firebase/getRangeData')
    // 取得所有分類
    if (!this.$store.state.firebase.allCategories) {
      await this.$store.dispatch('firebase/getAllCategories')
    }
  },
  methods: {
    date2Obj (inputDate) {
      const { years, months, date } = this.$moment(inputDate).toObject()
      return { years, months, date }
    },
    date2unix (inputDate) {
      return this.$moment(inputDate).unix()
    },
    dateIsSame (date, date2, limit = 'day') {
      return this.$moment(date).isSame(date2, limit)
    },
    changeMonth (fix) {
      const calc = fix ? 'add' : 'subtract'
      const { years, months, date } = this.$moment(this.currentDate)[calc](1, 'months').toObject()
      this.currentDate = { years, months, date }
      this.commitStore('firebase/SET_CURRENTDATERANGE', this.dateRange)
      this.$store.dispatch('firebase/getRangeData')
    },
    // 設定 class map
    setClass (date) {
      if (this.dateIsSame(date, this.selectDate)) { return 'select' }
      if (this.dateIsSame(date, this.today)) { return 'today' }
      if (!this.$moment(date).isBetween(this.isAfter, this.isBefore, undefined, '[)')) { return 'out-of-month' }
    },
    // 回到當天
    setToday () {
      this.currentDate = this.selectDate = this.today
    },
    // 選擇一天
    selectCurrentDate (date) {
      this.selectDate = date
      this.commitStore('firebase/SET_CURRENTSELECTDATE', date)
      this.$emit('datepicker_close')
    },
    commitStore (storeModule, value) {
      this.$store.commit(storeModule, value)
    }
  }
}
</script>
