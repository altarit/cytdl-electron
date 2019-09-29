import { Format, Preview } from '../../stores/previewStore'
import { SettingsStore } from '../../stores/settingsStore'
import { error, log } from '../../utils/logger'
import PREVIEW_STATUS from '../constants/previewStatus'
import DefaultExtractor from '../extractors/DefaultExtractor'
import { encodeDangerousFilePath, mkdirs } from '../utils/utils'
import { processNative, processWrapped } from './downloaderMethods'

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
  const tempRootDirName = mkdirs(opts.tempPath, `cytdl`)
  const tempRequestDirName = mkdirs(tempRootDirName, encodeDangerousFilePath(entry.requestId))
  const tempFilePath = `${tempRequestDirName}/${entry.id}-${entry.subId || ''}.${entry.selected!.ext || 'unknown'}`

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

export default {
  requestMetadata,
  requestProcessing,
}
