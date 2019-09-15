import { mapFormats } from '../../utils/utils'
import DefaultExtractor from '../DefaultExtractor'

export default new DefaultExtractor(
  'bandcamp-track',
  new RegExp('^https://([A-Za-z0-9]{1,40}).bandcamp.com/track/[A-Za-z0-9\\-]{1,60}$'),
  (info: any, url: string) => {
    const regexp = new RegExp(
      '^https://([A-Za-z0-9]{1,40}).bandcamp.com/track/[A-Za-z0-9\\-]{1,60}$'
    )
    const author = (url.match(regexp) || [])[1] || 'unknown'
    return {
      title: info.title,
      author,
      thumbnail: info.thumbnail,
      formats: mapFormats(info.formats),
    }
  }
)
