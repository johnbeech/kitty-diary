const gsjson = require('google-spreadsheet-to-json')
const { write, position } = require('promise-path')
const datapath = position(__dirname, '../data')
const spreadsheetId = '1-PRw2Ve-1iTNhXcxadSQ7mgZWWD513UbjjVKh8AkwAg'
const report = (...messages) => console.log('[Download Feeding Diary]', ...messages)

async function downloadData (spreadsheetId) {
  try {
    const worksheets = await gsjson({ spreadsheetId, allWorksheets: true })
    report('Downloaded data:', (worksheets + '').length, 'bytes')
    const entries = worksheets.reduce((acc, item) => acc.concat(item), [])
    const filename = 'feeding-diary.json'
    report('Writing combined data to:', filename)
    await write(datapath(filename), JSON.stringify(entries, null, 2), 'utf8')
  } catch (ex) {
    report('Unable to download data:', ex)
  }
}

async function start () {
  return downloadData(spreadsheetId)
}

module.exports = start
