const { read, write, position } = require('promise-path')
const convertGSheetsDate = require('./utils/convertGSheetsDate')
const datapath = position(__dirname, '../data')
const report = (...messages) => console.log('[Make Chart Feed]', ...messages)

function daysInMonth (month, year) {
  return new Date(year, month + 1, 0).getDate()
}

function makeDateCode(t) {
  return new Date(t).toISOString().substring(0, 7)
}

function recordType(counts, type) {
  if (type) {
    report('Counting', type)
    counts[type] = (counts[type] || 0) + 1
  }
}

function makeFeedingChart(feedingEntries) {
  const counts = {}
  feedingEntries.forEach(entry => {
    recordType(counts, entry.wetFoodMorning)
    recordType(counts, entry.wetFoodEvening)
    recordType(counts, entry.dryFoodMorning)
    recordType(counts, entry.dryFoodEvening)
  })

  const labels = Object.keys(counts)
  const data = labels.map(n => counts[n])

  const feedingChart = {
    labels,
    data
  }

  return feedingChart
}

async function readJson(file) {
  const fileContents = await read(datapath(file), 'utf8')
  return JSON.parse(fileContents)
}

async function makeChartFeed (feedingDiary) {
  const exampleChartData = [{
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
  const monthsInUse = [...new Set(timesInUse.map(makeDateCode))].map(dateCode => {
    const date = new Date(dateCode)
    const year = date.getUTCFullYear()
    const month = date.getUTCMonth()
    report('Processing', dateCode, 'Y:', year, 'M:', month, 'D:', daysInMonth(month, year))
    return {
      dateCode,
      title: [monthsOfTheYear[month], year].join(' ')
    }
  })

  feedingDiary.map(n => {
    const date = convertGSheetsDate(n.date)
    n.dateCode = makeDateCode(date.getTime())
    report('Date code', n.dateCode, 'from', date)
  })

  const feedingDataByMonth = monthsInUse.map(month => {
    const { dateCode, title } = month
    const feedingEntries = feedingDiary.filter(n => n.dateCode === dateCode)
    const feedingChart = makeFeedingChart(feedingEntries)
    return {
      dateCode,
      date: new Date(Date.parse(`${dateCode}-28T00:00:00.000Z`)),
      title,
      feedingChart
    }
  }).filter(n => n.feedingChart.data.length > 0)

  report('Feeding Data By Month', feedingDataByMonth)

  return write(datapath('feeding-charts.json'), JSON.stringify(feedingDataByMonth, null, 2), 'utf8')
}

async function start () {
  report('Reading feeding diary')
  const feedingDiary = await readJson('feeding-diary.json')

  return makeChartFeed(feedingDiary)
}

module.exports = start
