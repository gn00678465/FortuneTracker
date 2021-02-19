export const TO_CURRENCY = function (value) {
  let result = value.toString()
  const reg = /(-?\d+)(\d{3})/
  while (reg.test(result)) {
    result = result.replace(reg, '$1,$2')
  }
  return result
}
