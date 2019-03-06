const {
  isValidDate,
  isDateBefore,
  cleanURL,
  normalizedKeyword,
  printMessage
} = require('../src/utils')

require('dotenv').config()

describe('Print Message', () => {
  global.console = { log: jest.fn() }
  it('should not print if ENV debug variable is not set', () => {
    process.env.DEBUG = null
    printMessage('asdfsafdsd')
    expect(console.log).not.toBeCalled()
  })
  it('should not print if ENV debug variable is false', () => {
    process.env.DEBUG = false
    printMessage('asdfsafdsd')
    expect(console.log).not.toBeCalled()
  })
  it('should print if ENV debug variable is false', () => {
    process.env.DEBUG = true
    printMessage('asdfsafdsd')
    expect(console.log).toBeCalled()
  })
})

describe('Clean URL', () => {
  it('it should throw an error if URL is invalid', () => {
    expect(() => {
      cleanURL('/')
    }).toThrowError('Invalid URL')
  })
  it('it should be able to add https schema', () => {
    expect(cleanURL('www.example.com/')).toBe('https://www.example.com')
  })
  it('it should not be able to remove www', () => {
    expect(cleanURL('www.example.com/')).toBe('https://www.example.com')
  })
  it('it should be able to remove hash parameters', () => {
    expect(cleanURL('www.example.com/some-page.php#params')).toBe(
      'https://www.example.com/some-page.php'
    )
  })
  it('it should be able to remove query parameters', () => {
    expect(cleanURL('www.example.com/some-page.php?utm_sa=1&param2=2')).toBe(
      'https://www.example.com/some-page.php'
    )
  })
})

describe('Is Valid Date', () => {
  it('should be able to validate date formats', () => {
    expect(isValidDate('2018-01-01')).toBe(true)
    expect(isValidDate('0000-00-00')).toBe(false)
    expect(isValidDate('2018-1-01')).toBe(false)
    expect(isValidDate('2018/1/1')).toBe(false)
    expect(isValidDate('asdfadf')).toBe(false)
    expect(isValidDate(null)).toBe(false)
  })
})

describe('Is Date Before', () => {
  it('should be able to validate if one date is before other', () => {
    expect(() => {
      isDateBefore('20180101', '2018-02-02')
    }).toThrow()
    expect(isDateBefore('2018-01-01', '2018-02-02')).toEqual(true)
    expect(isDateBefore('2018-02-01', '2018-01-02')).toEqual(false)
  })
})
