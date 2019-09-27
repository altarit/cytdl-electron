import { log } from '../../../utils/logger'
import { mapFormats } from '../../utils/utils'
import DefaultExtractor from '../DefaultExtractor'

export default new DefaultExtractor(
  'vk-video',
  new RegExp('^https://vk.com/.{1,80}$'),
  (info: any, url: string) => {
    const size = info.length
    const author = info.playlist_uploader_id

    log(info)

    return {
      url,
      title: info.title,
      author,
      thumbnail: info.thumbnail,
      formats: mapFormats(info.formats),
    }
  }
)
