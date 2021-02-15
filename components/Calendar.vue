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
      <li v-for="date of makeCalender" :key="`${date.months}-${date.date}`">
        <button
          type="button"
          class="w-full pt-1 pb-3 text-md relative"
          :class="classes[setClass(date)]"
          :disabled="setClass(date) === 'out-of-month'"
          @click="selectCurrentDate(date)"
        >
          <p>{{ 10 > date.date ? `0${date.date}` : date.date }}</p>
          <p v-if="setClass(date) !== 'out-of-month'">
            <span v-if="date.expanse !== 0" class="absolute bottom-1 left-1/3 w-1.5 h-1.5 rounded-full bg-expense"></span>
            <span v-if="date.inconme !== 0" class="absolute bottom-1 right-1/3 w-1.5 h-1.5 rounded-full bg-income"></span>
          </p>
        </button>
      </li>
    </ul>
    <div class="flex justify-between items-center px-3">
      <p class="text-white mr-2">
        <span class="w-1.5 h-1.5 bg-expense rounded-full inline-block align-middle mr-1"></span>
        支出
      </p>
      <p class="text-white mr-auto">
        <span class="w-1.5 h-1.5 rounded-full bg-income inline-block align-middle mr-1"></span>
        收入
      </p>
      <button type="button" class="focus:outline-none ative:outline-none text-primary" @click="setToday">
        <span class="material-icons align-bottom">home</span>
        <span>今天</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
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
    makeCalender () {
      const firstDay = this.$moment(this.currentDate).date(1).day()
      const arr = []
      for (let i = 0; i < 42; i++) {
        const date = this.$moment(this.currentDate).date(1).subtract(firstDay, 'days').add(i, 'days')
        arr.push(this.date2Obj(date))
      }
      return arr
    },
    // 當前顯示月份第一天
    isBefore () {
      return this.$moment(this.currentDate).add(1, 'months').date(1)
    },
    // 當前顯示月份下一個月第一天
    isAfter () {
      return this.$moment(this.currentDate).date(1).subtract(1, 'days')
    },
    // date range
    dateRange: {
      get () {
        return [
          this.makeCalender[0],
          this.makeCalender.slice(-1)[0]
        ]
      }
    }
  },
  created () {
    this.today = this.currentDate = this.selectDate = this.date2Obj()
    this.commitStore('firebase/SET_CURRENTDATERANGE', this.dateRange)
  },
  methods: {
    date2Obj (inputDate) {
      const { years, months, date } = this.$moment(inputDate).toObject()
      return { years, months, date }
    },
    changeMonth (fix) {
      const calc = fix ? 'add' : 'subtract'
      const { years, months, date } = this.$moment(this.currentDate)[calc](1, 'months').toObject()
      this.currentDate = { years, months, date }
      this.commitStore('firebase/SET_CURRENTDATERANGE', this.dateRange)
    },
    // 設定 class map
    setClass (date) {
      if (this.$moment(date).isSame(this.currentDate, 'day')) { return 'select' }
      if (this.$moment(date).isSame(this.today)) { return 'today' }
      if (!this.$moment(date).isBetween(this.isAfter, this.isBefore)) { return 'out-of-month' }
    },
    // 回到當天
    setToday () {
      this.currentDate = this.selectDate = this.today
    },
    // 選擇一天
    selectCurrentDate (date) {
      this.currentDate = date
      this.commitStore('firebase/SET_CURRENTSELECTDATE', date)
    },
    commitStore (storeModule, value) {
      this.$store.commit(storeModule, value)
    }
  }
}
</script>
