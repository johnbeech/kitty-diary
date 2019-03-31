const { read, write, position } = require('promise-path')
const convertGSheetsDate = require('./utils/convertGSheetsDate')
const datapath = position(__dirname, '../data')
const report = (...messages) => console.log('[Make Chart Feed]', ...messages)

function daysInMonth (month, year) {
  return new Date(year, month + 1, 0).getDate()
}

async function readJson(file) {
  const fileContents = await read(datapath(file), 'utf8')
  return JSON.parse(fileContents)
}

async function makeChartFeed (feedingDiary) {
  const chartData = [{
      "date": "2019-03-30T00:00:00.000Z",
      "feedingChart": {
        "labels": ["Beef", "Poultry", "Chicken", "Lamb", "Salmon", "Orange"],
        "data": [5, 4, 3, 2, 1, 3]
      }
  }]

  const monthsOfTheYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const timesInUse = feedingDiary.map(n => convertGSheetsDate(n.date).getTime())
  const earliestTime = Math.min(...timesInUse)
  const latestTime = Math.max(...timesInUse)
  const monthsInUse = [...new Set(timesInUse.map(t => {
    return new Date(t).toISOString().substring(0, 7)
  }))].map(dateCode => {
    const date = new Date(dateCode)
    const year = date.getUTCFullYear()
    const month = date.getUTCMonth()
    report('Processing', dateCode, 'Y:', year, 'M:', month, 'D:', daysInMonth(month, year))
    return {
      dateCode,
      title: [monthsOfTheYear[month], year].join(' ')
    }
  })

  report('Months in use', monthsInUse)

  return write(datapath('feeding-charts.json'), JSON.stringify(chartData, null, 2), 'utf8')
}

async function start () {
  report('Reading feeding diary')
  const feedingDiary = await readJson('feeding-diary.json')

  return makeChartFeed(feedingDiary)
}

module.exports = start
