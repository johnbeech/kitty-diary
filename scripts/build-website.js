const path = require('path')
const { read, write, position, make, find } = require('promise-path')
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
  const fragmentBasePath = path.dirname(fragmentPath)
  const outFilePath = buildpath(fragmentPath)

  report('Writing template:', fragmentPath, outputString.length, 'bytes')
  await make(fragmentBasePath)
  return write(outFilePath, outputString, 'utf8')
}

async function findTemplateFiles() {
  const files = await find(templatepath('**/*.*'))
  return files.filter(n => /(css|html|js)/.test(n))
}

async function start () {
  const templateFiles = await findTemplateFiles()
  const data = {}
  return processTemplates(templateFiles, data)
}

module.exports = start
