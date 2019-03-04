const { read, write, position, find } = require('promise-path')
const handlebars = require('handlebars')

const datapath = position(__dirname, '../data')
const templatepath = position(__dirname, '../templates')
const buildpath = position(__dirname, '../build')
const report = (...messages) => console.log('[Build Website]', ...messages)

async function processTemplates (files, data) {
  const templateWork = files.map(filePath => processTemplate(filePath, data))
  return Promise.all(templateWork)
}

async function processTemplate(filePath, data) {
  const templateString = await read(filePath, 'utf8')
  const template = handlebars.compile(templateString)
  const outputString = template(data)

  const templatePathBase = templatepath('./')
  const fragmentPath = filePath.substring(templatePathBase.length)
  const outFilePath = buildpath(fragmentPath)

  report('Writing template:', fragmentPath, outputString.length, 'bytes')
  return write(outFilePath, outputString, 'utf8')
}

async function findFiles() {
  return find(templatepath('**/*'))
}

async function start () {
  const files = await findFiles()
  const data = {}
  return processTemplates(files, data)
}

module.exports = start
