import { mapFormats } from '../../utils/utils'
import DefaultExtractor from '../DefaultExtractor'

export default new DefaultExtractor(
  'youtube-video',
  new RegExp('^https://www.youtube.com/watch\\?v=[A-Za-z0-9_+-/]{11}$'),
  (info: any, url: string) => {
    return {
      title: info.title,
      author: info.creator,
      thumbnail: info.thumbnail,
      formats: mapFormats(info.formats),
      url: url,
    }
  }
)
