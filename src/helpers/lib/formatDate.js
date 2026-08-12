import moment from 'moment'

function formatToISODate (date) {
  if (!date) {
    return ''
  }
  return moment(date).format('YYYY-MM-DD')
}

function formatToRussianDate (date) {
  if (!date) {
    return ''
  }
  return moment(date).format('DD.MM.YYYY')
}

function formatToDate (date) {
  return moment(date).toDate()
}

export {
  formatToISODate,
  formatToRussianDate,
  formatToDate,
}