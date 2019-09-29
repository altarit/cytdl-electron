window.require = window.require || require;

const YoutubeExtractor = require('../extractors/impl/Youtube').default
const { error, log } = require('../../utils/logger')

beforeEach(() => {
  jest.resetModules()
  jest.dontMock('./downloader')
})

test('Simple mock', () => {
  const mockFn = jest.fn(scalar => 42 + scalar)

  const a = mockFn(0)
  const b = mockFn(1)

  expect(a).toBe(42)
  expect(b).toBe(43)

  expect(mockFn.mock.calls[0][0]).toBe(0)
  expect(mockFn.mock.calls[1][0]).toBe(1)
})

test('Success requestMetadata mp3', async () => {
  jest.doMock('youtube-dl', () => new Object({
    getInfo: function (url, arr, cb) {
      process.nextTick(() => {
        cb(null, {
          formats: [{
            ext: 'webm'
          }, {
            ext: 'mp3'
          }, {
            ext: 'mp4'
          }],
          creator: 'Rick Astley',
          title: 'Never gonna give you up'
        })
      })
    }
  }))
  const downloader = require('./downloader')

  const result = await downloader.requestMetadata('rewrewr', 0, 'http://youtubeqwe.com/werwe', YoutubeExtractor)
  expect(result.formats.length).toBe(3)
  expect(result.author).toBe('Rick Astley')
})

test('Error at getting info', async () => {
  jest.doMock('youtube-dl', () => new Object({
    getInfo: function (url, arr, cb) {
      process.nextTick(() => {
        cb(new Error('Is not a video'))
      })
    }
  }))
  const downloader = require('./downloader')

  try {
    const result = await downloader.requestMetadata('rewrewr', 0, 'http://youtubeqwe.com/werwe', YoutubeExtractor)

    throw new Error('Expected failure')
  } catch (e) {
    expect(e.message).toBe('Is not a video')
  }
})
