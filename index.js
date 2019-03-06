const fs = require('fs')
const _ = require('lodash')
const ngram = require('n-gram')
const json2csv = require('json2csv').parse
const argv = require('minimist')(process.argv.slice(2))

const GoogleClient = require('./src/GoogleClientFacade')

const { startDate, endDate } = argv

async function getLandingPagesWithConversions() {
  console.log('Getting landing pages with conversions')
  let landingsWithConversions
  let filename =
    'cache/' + startDate + '-' + endDate + '-landingsWithConversions.json'
  if (fs.existsSync(filename)) {
    console.log('--> From cache!')
    try {
      let rawJsonFile = fs.readFileSync(filename, 'utf8')
      landingsWithConversions = JSON.parse(rawJsonFile) || null
    } catch (err) {
      throw err
    }
  }

  if (!landingsWithConversions) {
    landingsWithConversions = await GoogleClient.analytics
      .getLandingPagesWithConversions({
        startDate,
        endDate
      })
      .catch(err => {
        throw err
      })
    if (landingsWithConversions)
      try {
        await fs.writeFileSync(
          filename,
          JSON.stringify(landingsWithConversions),
          'utf8'
        )
      } catch (err) {
        throw err
      }
  }

  return landingsWithConversions
}

async function getKeywordsForLandingPages(landings) {
  console.log('Getting Kw of those landing pages')
  let landingDetailedKeywords
  let filename =
    'cache/' + startDate + '-' + endDate + '-landingDetailedKeywords.json'
  if (fs.existsSync(filename)) {
    console.log('--> From cache!')
    try {
      let rawJsonFile = fs.readFileSync(filename, 'utf8')
      landingDetailedKeywords = JSON.parse(rawJsonFile) || null
    } catch (err) {
      throw err
    }
  }

  if (!landingDetailedKeywords) {
    landingDetailedKeywords = await await GoogleClient.searchConsole
      .getKeywordsForLandingPages(landings, {
        startDate,
        endDate
      })
      .catch(err => {
        throw err
      })
    if (landingDetailedKeywords)
      try {
        await fs.writeFileSync(
          filename,
          JSON.stringify(landingDetailedKeywords),
          'utf8'
        )
      } catch (err) {
        throw err
      }
  }
  return landingDetailedKeywords
}

function processWeightsOfKeywords(landingDetailedKeywords) {
  console.log('Processing weights')
  let weights = []
  for (let landingDetailedKeyword of landingDetailedKeywords) {
    if (
      landingDetailedKeyword.keywords == null ||
      landingDetailedKeyword.keywords.length === 0
    ) {
      continue
    }
    const totalClicks = landingDetailedKeyword.keywords.reduce((acc, val) => {
      return acc + val.clicks
    }, 0)
    const ratio = landingDetailedKeyword.conversions / totalClicks

    landingDetailedKeyword.keywords.forEach(kw => {
      weights.push({
        keyword: kw.keyword,
        weight: kw.clicks * ratio
      })
    })
  }
  weights = _.chain(weights)
    .reduce((memo, obj) => {
      if (typeof memo[obj.keyword] === 'undefined') {
        memo[obj.keyword] = 0
      }
      memo[obj.keyword] += obj.weight
      return memo
    }, {})
    .map((weight, key) => {
      return {
        keyword: key,
        weight: weight
      }
    })
    .sort((a, b) => {
      const keyA = a.weight
      const keyB = b.weight
      // Compare the 2 dates
      if (keyA < keyB) return 1
      if (keyA > keyB) return -1
      return 0
    })
    .value()

  return weights
}

async function saveAsCSV(weigthedConversions, filename) {
  let fields = ['keyword', 'weight']
  const generalOpts = {
    delimiter: ';'
  }

  try {
    let csv = json2csv(weigthedConversions, {
      ...generalOpts,
      fields
    })
    await fs.writeFileSync('output/' + filename, csv, 'utf8')
  } catch (err) {
    throw err
  }
}

function processNgram(level, weigthedConversions) {
  let weights = []
  weigthedConversions.forEach(element => {
    const normalizedKeyword = ngram(level)(element.keyword.split(' '))
    const ratio = normalizedKeyword.length
    normalizedKeyword.forEach(ngram => {
      weights.push({
        keyword: ngram.join(' '),
        weight: element.weight / ratio
      })
    })
  })

  weights = _.chain(weights)
    .reduce((memo, obj) => {
      if (typeof memo[obj.keyword] === 'undefined') {
        memo[obj.keyword] = 0
      }
      memo[obj.keyword] += obj.weight
      return memo
    }, {})
    .map((weight, key) => {
      return {
        keyword: key,
        weight: weight
      }
    })
    .sort((a, b) => {
      const keyA = a.weight
      const keyB = b.weight
      // Compare the 2 dates
      if (keyA < keyB) return 1
      if (keyA > keyB) return -1
      return 0
    })
    .value()

  return weights
}

function app() {
  return getLandingPagesWithConversions()
    .then(landingsWithConversions =>
      getKeywordsForLandingPages(landingsWithConversions)
    )
    .then(landingDetailedKeywords => {
      let weigthedConversions = processWeightsOfKeywords(
        landingDetailedKeywords
      )
      saveAsCSV(
        weigthedConversions,
        startDate + '-' + endDate + '-weigthedConversions.csv'
      )

      let weigthedConversions2ngram = processNgram(2, weigthedConversions)
      saveAsCSV(
        weigthedConversions2ngram,
        startDate + '-' + endDate + '-weigthedConversions-2-ngram.csv'
      )

      let weigthedConversions3ngram = processNgram(3, weigthedConversions)
      saveAsCSV(
        weigthedConversions3ngram,
        startDate + '-' + endDate + '-weigthedConversions-3-ngram.csv'
      )

      let weigthedConversions4ngram = processNgram(4, weigthedConversions)
      saveAsCSV(
        weigthedConversions4ngram,
        startDate + '-' + endDate + '-weigthedConversions-4-ngram.csv'
      )

      let weigthedConversions5ngram = processNgram(5, weigthedConversions)
      saveAsCSV(
        weigthedConversions5ngram,
        startDate + '-' + endDate + '-weigthedConversions-5-ngram.csv'
      )

      let weigthedConversions6ngram = processNgram(6, weigthedConversions)
      saveAsCSV(
        weigthedConversions6ngram,
        startDate + '-' + endDate + '-weigthedConversions-6-ngram.csv'
      )

      let weigthedConversions7ngram = processNgram(7, weigthedConversions)
      saveAsCSV(
        weigthedConversions7ngram,
        startDate + '-' + endDate + '-weigthedConversions-7-ngram.csv'
      )

      let weigthedConversions8ngram = processNgram(8, weigthedConversions)
      saveAsCSV(
        weigthedConversions8ngram,
        startDate + '-' + endDate + '-weigthedConversions-8-ngram.csv'
      )
    })
    .catch(err => console.error(err))
}

app()
