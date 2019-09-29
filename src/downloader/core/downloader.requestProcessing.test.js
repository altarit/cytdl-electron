import PREVIEW_STATUS from '../constants/previewStatus'
import { mockFsExtra } from '../../utils/testUtils'

window.require = window.require || require;

beforeEach(() => {
  jest.resetModules()
  jest.dontMock('./downloader')
})

test('Downloaded via processWrapped', async () => {
  mockFsExtra()
  jest.doMock('./downloaderMethods', () => new Object({
    processWrapped: (tempFilePath, finalFilePath, url, format, updateProgress) => {
      console.log(`Invoked processWrapped('${tempFilePath}', '${finalFilePath}', '${url}',`, format, `)`)
      return Promise.resolve()
        .then(() => {
          updateProgress(PREVIEW_STATUS.PROCESSING, `Processing...${100}%`)
        })
        .then(() => ({ finalFilePath }))
    },
    processNative: (...args) => {
      console.log(`Invoked processNative(${args.join(', ')})`)
    },
  }))

  const downloader = require('./downloader')

  let result = await downloader.requestProcessing({
    requestId: 'qwerty',
    title: 'Never Gonna Give U Up',
    selected: {
      ext: 'mp3',
      format_id: '42',
    }
  }, (status, progress) => {
    console.log('Progress: ', progress, status)
  }, {
    tempPath: '/tmp',
    outputPath: '/out',
  })
  console.log(result)

  expect(result.finalFilePath).toBe('/out/Never Gonna Give U Up[42].mp3')
})
