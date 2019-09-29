import { mockFsExtra } from '../../utils/testUtils'

window.require = window.require || require;

const {Readable, Writable} = require('stream')
//const streamify = require('streamify')

beforeEach(() => {
  jest.resetModules()
  jest.dontMock('./downloaderMethods')
})

test('processNative', async () => {
  mockFsExtra()
  jest.doMock('youtube-dl', () => new Object({
    exec: (url, options, _, cb) => {
      console.log('youtube-dl.exec')

      setTimeout(() => {
        cb(null, [ 'Downloaded 40%', 'Downloaded 100%' ])
      }, 10)
    }
  }))

  const { processNative } = require('./downloaderMethods')

  let result = await processNative(
    'tmp.mp3',
    'out.mp3',
    'qweewrewre',
    { format_id: '42', ext: 'mp3' },
    () => console.log('update cb')
  )

  console.log(result)

  expect(result.finalFilePath).toBe('out.mp3')
})
