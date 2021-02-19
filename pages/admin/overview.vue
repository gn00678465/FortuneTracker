<template>
  <div>
    <!-- charts -->
    <client-only>
      <Apexchart type="bar" :options="chartOptions" :series="chartSeries" />
    </client-only>
    <!-- datas -->
    <template v-if="sortByDate">
      <ListData v-for="(dataArr , key) of sortByDate" :key="key">
        <template #date>
          <span>{{ key }} ( {{ dataArr.length }} )</span>
        </template>
        <template #data>
          <li v-for="data of dataArr" :key="data.id">
            <Card v-bind="data" />
          </li>
        </template>
      </ListData>
    </template>
    <template v-else>
      <p class="text-2xl text-center text-white py-3">
        無資料
      </p>
    </template>
  </div>
</template>

<script>
export default {
  computed: {
    // 依日期整理資料
    sortByDate () {
      const data = this.$store.state.firebase.allRangeData
      if (!data) {
        return undefined
      }
      return data.reduce((obj, item) => {
        const date = this.date2str(item.date)
        if (!(date in obj)) {
          obj[date] = []
          obj[date].push(item)
        } else {
          obj[date].push(item)
        }
        return obj
      }, {})
    },
    // 繪製圖表用資料
    chartSeries () {
      if (!this.sortByDate) {
        return
      }
      const series = [
        {
          name: '支出',
          data: []
        },
        {
          name: '收入',
          data: []
        }
      ]
      Object.keys(this.sortByDate).forEach((date) => {
        const expenseArr = this.dataFilter(this.sortByDate[date], true)
        const incomeArr = this.dataFilter(this.sortByDate[date], false)
        series[0].data.push(this.dataReduce(expenseArr))
        series[1].data.push(this.dataReduce(incomeArr))
      })
      return series
    },
    // 圖表參數
    chartOptions () {
      if (!this.sortByDate) {
        return {
          // 無資料時顯示
          noData: {
            text: '目前無任何資料',
            style: {
              color: '#fff',
              fontSize: '24px'
            }
          }
        }
      }
      return {
        chart: {
          type: 'bar',
          height: 350,
          toolbar: {
            show: false
          }
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          }
        },
        dataLabels: {
          enabled: false
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          labels: {
            colors: '#fff'
          }
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        colors: ['#f76c83', '#94c962'],
        // 顯示小視窗設定
        tooltip: {
          y: {
            // 將 tooltip 改為貨幣顯示方式
            formatter (value) {
              let result = value.toString()
              const reg = /(-?\d+)(\d{3})/
              while (reg.test(result)) {
                result = result.replace(reg, '$1,$2')
              }
              return '$' + result
            }
          }
        },
        // x 軸設定
        xaxis: {
          categories: Object.keys(this.sortByDate),
          labels: {
            style: {
              colors: '#fff'
            },
            formatter (value) {
              return value.split('-').slice(1).join('/')
            }
          }
        },
        // y 軸設定
        yaxis: {
          labels: {
            style: {
              colors: '#fff'
            },
            formatter: (value) => {
              return Math.abs(value) > 999 ? Math.sign(value) * ((Math.abs(value) / 1000).toFixed(1)) + 'k' : Math.sign(value) * Math.abs(value)
            }
          }
        },
        fill: {
          opacity: 1
        }
      }
    }
  },
  methods: {
    // unixtime 轉字串格式
    date2str (date) {
      return this.$moment.unix(date).format('YYYY-MM-DD')
    },
    // data reduce
    dataReduce (arr) {
      if (arr.length === 0) {
        return 0
      }
      return arr.reduce((accu, curr) => {
        return curr.price + accu
      }, 0)
    },
    dataFilter (arr, isExpense) {
      return arr.filter((item) => {
        return item.isExpense === isExpense
      })
    }
  }
}
</script>
