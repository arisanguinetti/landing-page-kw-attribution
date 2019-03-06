const dotenv = require('dotenv')
const _ = require('lodash')
const { google } = require('googleapis')

const { isValidDate, isDateBefore, cleanURL, printMessage } = require('./utils')

dotenv.config()

const GoogleClient = {
  client_email: process.env.CLIENT_EMAIL,
  private_key: process.env.PRIVATE_KEY,
  site_url: process.env.SITE_URL,
  scopes: [
    'https://www.googleapis.com/auth/webmasters',
    'https://www.googleapis.com/auth/webmasters.readonly',
    'https://www.googleapis.com/auth/analytics',
    'https://www.googleapis.com/auth/analytics.readonly'
  ],
  google,
  data: {
    analyticsViewId: process.env.ANALYTICS_VIEW_ID,
    startDate: null,
    endDate: null,
    jwt: null,
    auth: null
  }
}

GoogleClient.data.jwt = new google.auth.JWT(
  GoogleClient.client_email,
  null,
  GoogleClient.private_key,
  GoogleClient.scopes
)

GoogleClient.authorize = async () => {
  if (GoogleClient.data.auth == null) {
    let auth = await GoogleClient.data.jwt.authorize().catch(err => {
      throw new Error(err)
    })
    GoogleClient.data.auth = auth
  }
}

GoogleClient.utils = {
  validateDates: (options = null) => {
    if (options == null) {
      throw new Error('Options parameter is required!')
    }

    const { startDate, endDate } = options

    if (startDate == null) {
      throw new Error('Missing startDate!')
    }

    if (endDate == null) {
      throw new Error('Missing endDate!')
    }

    if (!isValidDate(startDate)) {
      throw new Error('Invalid startDate format, expected YYYY-MM-DD!')
    }

    if (!isValidDate(endDate)) {
      throw new Error('Invalid endDate format, expected YYYY-MM-DD!')
    }

    if (!isDateBefore(startDate, endDate)) {
      throw new Error('startDate should be before endDate!')
    }
  }
}

GoogleClient.analytics = {
  processResponse: (res = null) => {
    if (!res.data || !res.data.reports || !(res.data.reports instanceof Array))
      throw new Error('Invalid response from Google Analytics')

    const report = res.data.reports[0]

    const rawData = report.data.rows
      .filter(row => {
        const rawURL = row.dimensions[0]
        // TODO: understand how to handle (not set) landing pages
        if (rawURL === '(not set)') {
          return false // skip
        }
        return true
      })
      .map(row => {
        const normalizedURL = cleanURL(process.env.SITE_URL + row.dimensions[0])

        return {
          url: normalizedURL,
          conversions: parseInt(row.metrics[0].values[0])
        }
      })

    let data = _.chain(rawData)
      .reduce((memo, obj) => {
        if (typeof memo[obj.url] === 'undefined') {
          memo[obj.url] = {
            conversions: 0
          }
        }
        memo[obj.url].conversions += obj.conversions
        return memo
      }, {})
      .map((val, key) => {
        const { conversions } = val
        return {
          url: key,
          conversions
        }
      })
      .sort((a, b) => {
        const keyA = a.conversions
        const keyB = b.conversions
        // Compare the 2 dates
        if (keyA < keyB) return 1
        if (keyA > keyB) return -1
        return 0
      })
      .value()

    return data
  },
  getLandingPagesWithConversions: async (options = null) => {
    if (options == null) {
      throw new Error('Options parameter is required!')
    }

    try {
      GoogleClient.utils.validateDates(options)
    } catch (err) {
      throw err
    }

    await GoogleClient.authorize().catch(err => {
      throw err
    })

    let req = GoogleClient.google
      .analyticsreporting('v4')
      .reports.batchGet({
        auth: GoogleClient.data.jwt,
        requestBody: {
          reportRequests: [
            {
              viewId: GoogleClient.data.analyticsViewId,
              dateRanges: [
                {
                  startDate: options.startDate,
                  endDate: options.endDate
                }
              ],
              metrics: [
                {
                  expression: 'ga:goalCompletionsAll'
                }
              ],
              dimensions: [
                {
                  name: 'ga:landingPagePath'
                }
              ],
              dimensionFilterClauses: [
                {
                  filters: [
                    {
                      dimensionName: 'ga:sourceMedium',
                      expressions: ['google / organic'],
                      operator: 'EXACT'
                    }
                  ]
                }
              ]
            }
          ]
        }
      })
      .catch(err => {
        throw err
      })

    let res = await req

    return GoogleClient.analytics.processResponse(res)
  }
}

GoogleClient.searchConsole = {
  processResponse: (res = null) => {
    if (!res || !(res instanceof Object) || !res.data) {
      throw new Error('Invalid response from Google Search Console')
    }

    if (!res.data.rows || !(res.data.rows instanceof Array)) {
      printMessage('No data for current landing')
      return
    }

    const rawData = res.data.rows

    let data = _.chain(rawData)
      .filter(data => data.clicks > 0)
      .reduce((acc, row) => {
        const { clicks } = row

        const keyword = row.keys[0]
        acc.push({
          keyword,
          clicks
        })
        return acc
      }, [])
      .sort((a, b) => {
        const keyA = a.clicks
        const keyB = b.clicks
        // Compare the 2 dates
        if (keyA < keyB) return 1
        if (keyA > keyB) return -1
        return 0
      })
      .value()

    return data
  },
  getKeywordsForLandingPage: async (landing = null, options = null) => {
    if (landing == null) {
      throw new Error('Landing parameter is required!')
    }

    if (options == null) {
      throw new Error('Options parameter is required!')
    }

    try {
      GoogleClient.utils.validateDates(options)
    } catch (err) {
      throw err
    }

    printMessage(' --> Getting Kws for landing page ' + landing)

    await GoogleClient.authorize().catch(err => {
      throw err
    })

    let req = google
      .webmasters('v3')
      .searchanalytics.query({
        auth: GoogleClient.data.jwt,
        siteUrl: process.env.SITE_URL,
        requestBody: {
          startDate: options.startDate,
          endDate: options.endDate,
          searchType: 'web',
          dimensions: ['query'],
          dimensionFilterGroups: [
            {
              filters: [
                {
                  dimension: 'page',
                  expression: landing,
                  operator: 'contains'
                }
              ]
            }
          ],
          rowLimit: 10000
        }
      })
      .catch(err => {
        throw err
      })

    let res = await req

    return res
  },
  getKeywordsForLandingPages: async (landings = null, options = null) => {
    if (landings == null) {
      throw new Error('Landing parameter is required!')
    }

    if (options == null) {
      throw new Error('Options parameter is required!')
    }

    GoogleClient.utils.validateDates(options)
    let responses = []
    for (let landing of landings) {
      const { url, conversions } = landing

      const res = await GoogleClient.searchConsole
        .getKeywordsForLandingPage(url, options)
        .catch(err => {
          throw err
        })

      if (res) {
        const keywords = GoogleClient.searchConsole.processResponse(res)

        responses.push({
          url,
          conversions,
          keywords
        })
      }
    }
    return responses
  }
}

module.exports = GoogleClient
