import { log } from '../utils/logger'

const youtubedl = window.require('youtube-dl')

export function getInfo(urls: string[]) {
  log('getInfo', urls)

  const video = youtubedl(urls[0], ['--format=18'], { cwd: __dirname })

  // Will be called when the download starts.
  video.on('info', (info: any) => {
    log('Download started')
    log('filename: ' + info._filename)
    log('size: ' + info.size)
  })
}
