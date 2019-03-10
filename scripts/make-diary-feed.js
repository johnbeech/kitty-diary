const { read, write, position } = require('promise-path')
const convertGSheetsDate = require('./utils/convertGSheetsDate')
const datapath = position(__dirname, '../data')
const report = (...messages) => console.log('[Make Diary Feed]', ...messages)

async function readJson(file) {
  const fileContents = await read(datapath(file), 'utf8')
  return JSON.parse(fileContents)
}

async function makeDiaryFeed (feedingDiary, photoFeed) {
  feedingDiary = feedingDiary.filter(n => n.wetFoodMorning)
  feedingDiary.forEach(n => {
    n.date = convertGSheetsDate(n.date)
  })
  photoFeed.forEach(n => {
    n.date = new Date(Date.parse(n.date))
  })

  const feedData = [].concat(feedingDiary, photoFeed).sort((a, b) => {
    return a.date.getTime() - b.date.getTime()
  })
  return write(datapath('diary-feed.json'), JSON.stringify(feedData, null, 2), 'utf8')
}

async function start () {
  const feedingDiary = await readJson('feeding-diary.json')
  const photoFeed = await readJson('photo-feed.json')
  return makeDiaryFeed(feedingDiary, photoFeed)
}

module.exports = start
