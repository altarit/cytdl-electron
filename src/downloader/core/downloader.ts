import { Format, Preview } from '../../stores/previewStore'
import { SettingsStore } from '../../stores/settingsStore'
import { error, log } from '../../utils/logger'
import PREVIEW_STATUS from '../constants/previewStatus'
import DefaultExtractor from '../extractors/DefaultExtractor'
import { encodeDangerousFilePath, mkdirs } from '../utils/utils'

const youtubedl = window.require('youtube-dl')
const fs = window.require('fs-extra')
const rootDir = __dirname

export function requestMetadata(
  requestId: string,
  i: number,
  current: string,
  type: DefaultExtractor
) {
  return new Promise((resolve, reject) => {
    const url = current

    log('#url:', url)

    youtubedl.getInfo(url, [], (err: Error, info: any) => {
      if (err) {
        reject(err)
        return
      }

      // log(info)
      const result = type.extract(info, url)

      if (!result.title || !result.author) {
        // log(result)
        result.author = 'Unknown author'
        // throw new Error('Missed video info properties.')
      }

      resolve(result)
    })
  })
}

export function requestProcessing(entry: Preview, updateProgress: Function, opts: SettingsStore) {
  const rootDirName = mkdirs(`media`, encodeDangerousFilePath(entry.requestId))
  const tempDirName = mkdirs(rootDirName, 'temp')
  const tempFilePath = `${tempDirName}/${entry.id}-${entry.subId || ''}.${entry.selected!.ext ||
    'unknown'}`

  const finalDirName = mkdirs(opts.outputPath)
  const finalFileName = `${encodeDangerousFilePath(entry.title)}[${entry.selected!.format_id}].${
    entry.selected!.ext
  }`
  const finalFilePath = finalDirName + '/' + finalFileName

  if (entry.selected && entry.selected.special) {
    return processNative(tempFilePath, finalFilePath, entry.url, entry.selected!, updateProgress)
  } else {
    return processWrapped(tempFilePath, finalFilePath, entry.url, entry.selected!, updateProgress)
  }
}

function processWrapped(
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
  })
}

function processNative(
  tempFilePath: string,
  finalFilePath: string,
  url: string,
  format: Format,
  updateProgress: any
) {
  updateProgress(PREVIEW_STATUS.PROCESSING, `Processing... Please wait.`)

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
  requestMetadata,
  requestProcessing,
}
