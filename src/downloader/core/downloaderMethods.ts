import { Format, Preview } from '../../stores/previewStore'
import { error, log } from '../../utils/logger'
import PREVIEW_STATUS from '../constants/previewStatus'

const youtubedl = window.require('youtube-dl')
const fs = window.require('fs-extra')
const rootDir = __dirname

export function processWrapped(
  tempFilePath: string,
  finalFilePath: string,
  url: string,
  format: Format,
  updateProgress: Function
) {
  return new Promise((resolve, reject) => {
    const video = youtubedl(url, [`--format=${format.format_id}`], { cwd: rootDir })

    let size = 0
    let downloaded = 0
    let lastUpdate = 0
    let details = null

    video.on('info', (info: any) => {
      log('size: ' + info.size)
      size = info.size
      details = info
    })

    video.on('data', (chunk: any) => {
      downloaded += chunk.length
      const progress = Math.round((100 * downloaded) / size)

      const now = Date.now()
      if (now - lastUpdate > 2000) {
        lastUpdate = now
        updateProgress(PREVIEW_STATUS.PROCESSING, `Processing...${progress}%`)
      }
    })

    video.on('complete', (info: any) => {
      log('complete')
    })

    video.on('end', () => {
      log('end')
      updateProgress(PREVIEW_STATUS.POSTPROCESSING, `Processed. 100%`)

      fs.copy(tempFilePath, finalFilePath)
        .then((cb: Function) => {
          resolve({
            finalFilePath,
          })
        })
        .catch((err: Error) => {
          error(`Error at moving a file.`, err)
          reject({
            status: PREVIEW_STATUS.FAILED_POSTPROCESSING,
            title: ``,
          })
        })
    })

    video.pipe(fs.createWriteStream(tempFilePath))

    updateProgress(PREVIEW_STATUS.PROCESSING, `Processing... Please wait.`)
  })
}

export function processNative(
  tempFilePath: string,
  finalFilePath: string,
  url: string,
  format: Format,
  updateProgress: any
) {
  updateProgress(PREVIEW_STATUS.PROCESSING, `Processing... Please wait.`)


  console.log(youtubedl)
  return new Promise((resolve, reject) => {
    youtubedl.exec(
      url,
      ['-x', '--audio-format', format.ext, '-o', tempFilePath],
      {},
      (err: Error, output: any) => {
        if (err) {
          reject({
            status: PREVIEW_STATUS.FAILED_POSTPROCESSING,
            title: ``,
          })
          return
        }

        // log(output.join('\n'));
        updateProgress(PREVIEW_STATUS.PROCESSING, `Processing...${100}%`)

        fs.copy(tempFilePath, finalFilePath)
          .then((cb: Function) => {
            resolve({
              finalFilePath,
            })
          })
          .catch((err: Error) => {
            error(`Error at moving a file.`, err)
            reject({
              status: PREVIEW_STATUS.FAILED_POSTPROCESSING,
              title: ``,
            })
          })
      }
    )
  })
}

export default {
  processNative,
  processWrapped,
}
