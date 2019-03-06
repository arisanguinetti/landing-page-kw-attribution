const GoogleClient = require('../src/GoogleClientFacade')

const validInputs = {
  startDate: '2018-01-01',
  endDate: '2018-01-02'
}
const invalidInputs1 = {
  startDate: '2018/01/01',
  endDate: '2018/01/02'
}
const invalidInputs2 = {
  endDate: '2018/01/01'
}

const landingsWithConversionsMock = [
  {
    url: '/',
    conversions: '88'
  }
]

describe('Google Client Utils', () => {
  it('should be able to have a function to validate date ranges', () => {
    expect(GoogleClient.utils.validateDates).toBeDefined()
  })
  it('should be able to have a function to not throw an error on valid date ranges', () => {
    expect(() => GoogleClient.utils.validateDates(validInputs)).not.toThrow()
  })
  it('should be able to have a function to throw an error on invalid date ranges', () => {
    expect(() => GoogleClient.utils.validateDates(invalidInputs1)).toThrow()
    expect(() => GoogleClient.utils.validateDates(invalidInputs2)).toThrow()
  })
})

describe('Google Client Auth', () => {
  it('should be able to get a client email', () => {
    expect(GoogleClient.client_email).not.toBeUndefined()
    expect(GoogleClient.client_email).not.toBeNull()
  })
  it('should be able to get a private key', () => {
    expect(GoogleClient.private_key).not.toBeUndefined()
    expect(GoogleClient.private_key).not.toBeNull()
  })
  it('should be able to get a google client', () => {
    expect(GoogleClient.google).not.toBeUndefined()
    expect(GoogleClient.google).not.toBeNull()
  })
  it('should be able to get google credentials', () => {
    expect(GoogleClient.data.jwt).not.toBeUndefined()
    expect(GoogleClient.data.jwt).not.toBeNull()
  })
  it('should be able to get google authorization', async () => {
    let throwError = false

    await GoogleClient.authorize().catch(() => {
      throwError = true
    })

    expect(throwError).toBe(false)
    expect(GoogleClient.data.auth.access_token).not.toBeUndefined()
    expect(GoogleClient.data.auth.access_token).not.toBeNull()
  })
  it('should be able to get google authorization access_token', async () => {
    let throwError = false

    await GoogleClient.authorize().catch(() => {
      throwError = true
    })

    expect(throwError).toBe(false)
    expect(GoogleClient.data.auth.access_token).not.toBeUndefined()
    expect(GoogleClient.data.auth.access_token).not.toBeNull()
  })
})

describe('Google Client Analytics', () => {
  it('should be able to get a analytics view ID', () => {
    expect(GoogleClient.data.analyticsViewId).not.toBeUndefined()
    expect(GoogleClient.data.analyticsViewId).not.toBeNull()
  })
  it('should be able to get an analytics object', () => {
    expect(GoogleClient.analytics).not.toBeUndefined()
    expect(GoogleClient.analytics).not.toBeNull()
  })
  it('should be able to have a function to get a report on conversion per landing page', () => {
    expect(GoogleClient.analytics.getLandingPagesWithConversions).toBeDefined()
  })
  it('should be able to call a function to get a report on conversion per landing page', async () => {
    let throwError = false

    await GoogleClient.analytics.getLandingPagesWithConversions().catch(() => {
      throwError = true
    })

    expect(throwError).toBe(true)

    throwError = false

    await GoogleClient.analytics
      .getLandingPagesWithConversions(validInputs)
      .catch(() => {
        throwError = true
      })

    expect(throwError).toBe(false)

    throwError = false

    await GoogleClient.analytics
      .getLandingPagesWithConversions(invalidInputs1)
      .catch(() => {
        throwError = true
      })

    expect(throwError).toBe(true)
  })
})

describe('Google Client Search Console', () => {
  it('should be able to get a site url', () => {
    expect(GoogleClient.site_url).not.toBeUndefined()
    expect(GoogleClient.site_url).not.toBeNull()
  })
})

describe('Google Client Search Console getKeywordsForLandingPages', () => {
  it('GoogleClient.searchConsole.getKeywordsForLandingPages should be a function', () => {
    expect(GoogleClient.searchConsole.getKeywordsForLandingPages).toBeDefined()
  })
  it('GoogleClient.searchConsole.getKeywordsForLandingPages should throw an Error if no params are passed', async () => {
    let throwError = false

    await GoogleClient.searchConsole.getKeywordsForLandingPages().catch(() => {
      throwError = true
    })

    expect(throwError).toBe(true)
  })
  it('GoogleClient.searchConsole.getKeywordsForLandingPages should throw an Error if landing param is missing', async () => {
    let throwError = false

    await GoogleClient.searchConsole
      .getKeywordsForLandingPages(validInputs)
      .catch(() => {
        throwError = true
      })

    expect(throwError).toBe(true)
  })
  it('GoogleClient.searchConsole.getKeywordsForLandingPages should throw an Error if options param is missing', async () => {
    let throwError = false

    await GoogleClient.searchConsole
      .getKeywordsForLandingPages(landingsWithConversionsMock)
      .catch(() => {
        throwError = true
      })

    expect(throwError).toBe(true)
  })
  it('GoogleClient.searchConsole.getKeywordsForLandingPages should not throw an Error if options and landing params are passed', async () => {
    let throwError = false

    await GoogleClient.searchConsole
      .getKeywordsForLandingPages(landingsWithConversionsMock, validInputs)
      .catch(() => {
        throwError = true
      })

    expect(throwError).toBe(false)
  })
})

describe('Google Client Search Console getKeywordsForLandingPage', () => {
  it('GoogleClient.searchConsole.getKeywordsForLandingPage should be a function', () => {
    expect(GoogleClient.searchConsole.getKeywordsForLandingPage).toBeDefined()
  })
  it('GoogleClient.searchConsole.getKeywordsForLandingPage should throw an Error if no params are passed', async () => {
    let throwError = false

    await GoogleClient.searchConsole.getKeywordsForLandingPage().catch(() => {
      throwError = true
    })

    expect(throwError).toBe(true)
  })
  it('GoogleClient.searchConsole.getKeywordsForLandingPage should throw an Error if landing param is missing', async () => {
    let throwError = false

    await GoogleClient.searchConsole
      .getKeywordsForLandingPage(validInputs)
      .catch(() => {
        throwError = true
      })

    expect(throwError).toBe(true)
  })
  it('GoogleClient.searchConsole.getKeywordsForLandingPage should throw an Error if options param is missing', async () => {
    let throwError = false

    await GoogleClient.searchConsole
      .getKeywordsForLandingPage(landingsWithConversionsMock)
      .catch(() => {
        throwError = true
      })

    expect(throwError).toBe(true)
  })
  it('GoogleClient.searchConsole.getKeywordsForLandingPage should not throw an Error if options and landing params are passed', async () => {
    let throwError = false

    await GoogleClient.searchConsole
      .getKeywordsForLandingPage(landingsWithConversionsMock, validInputs)
      .catch(() => {
        throwError = true
      })

    expect(throwError).toBe(true)
  })
})
