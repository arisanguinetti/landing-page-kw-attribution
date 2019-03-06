const normalizeUrl = require('normalize-url')
const dotenv = require('dotenv')
dotenv.config()

const isValidDate = dateString => {
  if (dateString == null) return false
  const regEx = /^\d{4}-\d{2}-\d{2}$/
  if (!dateString.match(regEx)) return false // Invalid format
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return false // Invalid date
  return d.toISOString().slice(0, 10) === dateString
}

const isDateBefore = (olderDate, newerDate) => {
  if (!isValidDate(olderDate) || !isValidDate(newerDate))
    throw new Error('Invalid date formats')
  const older = new Date(olderDate)
  const newer = new Date(newerDate)
  return newer - older > 0
}

const cleanURL = url => {
  const normalizedUrl = normalizeUrl(url, {
    forceHttps: true,
    stripHash: true,
    stripWWW: false,
    removeQueryParameters: [/.*/i]
  })
  return normalizedUrl
}

const printMessage = message => {
  if (
    typeof process.env.DEBUG !== 'undefined' &&
    process.env.DEBUG === 'true'
  ) {
    console.log('-->' + message)
  }
}

printMessage()

module.exports = {
  isValidDate,
  isDateBefore,
  cleanURL,
  printMessage
}
