const { read, write, position } = require('promise-path')
const datapath = position(__dirname, '../data')
const report = (...messages) => console.log('[Make Diary Feed]', ...messages)

async function readJson(file) {
  const fileContents = await read(datapath(file), 'utf8')
  return JSON.parse(fileContents)
}

async function makeDiaryFeed (feedingDiary, photoFeed) {
  // TODO: Add dates, sort the two feeds into order
  const feedData = {
    feedingDiary,
    photoFeed
  }
  return write(datapath('diary-feed.json'), JSON.stringify(feedData), 'utf8')
}

async function start () {
  const feedingDiary = await readJson('feeding-diary.json')
  const photoFeed = await readJson('photo-feed.json')
  return makeDiaryFeed(feedingDiary, photoFeed)
}

module.exports = start
