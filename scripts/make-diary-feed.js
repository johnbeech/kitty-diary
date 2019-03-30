const { read, write, position } = require('promise-path')
const convertGSheetsDate = require('./utils/convertGSheetsDate')
const datapath = position(__dirname, '../data')
const report = (...messages) => console.log('[Make Diary Feed]', ...messages)

async function readJson(file) {
  const fileContents = await read(datapath(file), 'utf8')
  return JSON.parse(fileContents)
}

async function makeDiaryFeed (feedingDiary, feedingCharts, photoFeed) {
  report('Making diary-feed.json')
  feedingDiary = feedingDiary.filter(n => n.wetFoodMorning)
  feedingDiary.forEach(n => {
    n.date = convertGSheetsDate(n.date)
  })
  feedingCharts.forEach(n => {
    n.date = new Date(Date.parse(n.date))
  })
  photoFeed.forEach(n => {
    n.date = new Date(Date.parse(n.date))
  })

  const feedData = [].concat(feedingDiary, feedingCharts, photoFeed).sort((a, b) => {
    return a.date.getTime() - b.date.getTime()
  })
  return write(datapath('diary-feed.json'), JSON.stringify(feedData, null, 2), 'utf8')
}

async function start () {
  report('Reading feeding diary')
  const feedingDiary = await readJson('feeding-diary.json')
  report('Reading feeding charts')
  const feedingCharts = await readJson('feeding-charts.json')
  report('Reading photo feed')
  const photoFeed = await readJson('photo-feed.json')
  return makeDiaryFeed(feedingDiary, feedingCharts, photoFeed)
}

module.exports = start
