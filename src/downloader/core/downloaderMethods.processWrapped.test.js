import { mockFsExtra } from '../../utils/testUtils'

window.require = window.require || require;

const {Readable, Writable} = require('stream')
//const streamify = require('streamify')

beforeEach(() => {
  jest.resetModules()
  jest.dontMock('./downloaderMethods')
})

test('processWrapped', async () => {
  mockFsExtra()
  jest.doMock('youtube-dl', () => (url, formats, dirname) => {
    console.log('youtube-dl()')
    let count = 0
    let stream = new Readable({
      read(size) {
        if (count === 0) {
          this.emit('info', {
            creator: 'Rick',
            title: 'Never gonna give you up',
            size: 5120
          })
        }
        this.push(new Uint8Array(1024))
        if (count === 5) {
          this.push(null)
        }
        count++
      }
    })

    return stream
  })

  const { processWrapped } = require('./downloaderMethods')

  let result = await processWrapped(
    'tmp.mp3',
    'out.mp3',
    'qweewrewre',
    { format_id: '42', ext: 'mp3' },
    () => console.log('update cb')
  )

  console.log(result)

  expect(result.finalFilePath).toBe('out.mp3')
})
