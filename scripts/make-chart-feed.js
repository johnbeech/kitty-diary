const { read, write, position } = require('promise-path')
const convertGSheetsDate = require('./utils/convertGSheetsDate')
const datapath = position(__dirname, '../data')
const report = (...messages) => console.log('[Make Chart Feed]', ...messages)

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

  return write(datapath('feeding-charts.json'), JSON.stringify(chartData, null, 2), 'utf8')
}

async function start () {
  report('Reading feeding diary')
  const feedingDiary = await readJson('feeding-diary.json')

  return makeChartFeed(feedingDiary)
}

module.exports = start
