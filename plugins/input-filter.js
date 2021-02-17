import Vue from 'vue'

function debounce (fun, wait = 300, immediate = true) {
  // 計時器
  let timer

  // 返回一個函式，此函式會在一個時間區間結束後的 wait 毫秒時執行 fn 函式
  return function () {
    // 保存函式調用時的執行環境 & 參數
    const context = this
    const args = arguments

    const later = function () {
      timer = null
      if (!immediate) {
        fun.apply(context, args)
      }
    }
    // 清除計時器
    clearTimeout(timer)

    // 判斷是否需要立刻執行
    const callNow = immediate && !timer
    timer = setTimeout(later, wait)
    // 如為 true 立刻執行 function
    if (callNow) {
      fun.apply(context, args)
    }
  }
}

const addListener = function (el, type, fn) {
  el.addEventListener(type, fn, false)
}

// 除去空格
const trimSpace = function (el) {
  addListener(el, 'input', function () {
    el.value = el.value.replace(/\s+/, '')
  })
}

// 限制只能輸入整數
const integer = function (el) {
  addListener(el, 'keyup', debounce(() => {
    el.value = (el.value.match(/^\d*/g)[0]) || null
    if (isNaN(el.value)) {
      el.value = ''
    }
  }))
}

Vue.directive('input-filter', {
  bind (el, binding) {
    trimSpace(el)
    switch (binding.arg) {
      case 'price':
        integer(el)
        break
      default:
        console.warn('未知指令', binding.arg)
    }
  }
})
