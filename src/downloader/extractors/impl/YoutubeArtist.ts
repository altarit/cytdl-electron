import { log } from '../../../utils/logger'
import { mapFormats } from '../../utils/utils'
import DefaultExtractor from '../DefaultExtractor'

export default new DefaultExtractor(
  'youtube-playlist',
  new RegExp('^https://www.youtube.com/user/[A-Za-z0-9+/_\\-]{1,50}/videos$'),
  (info: any, url: string) => {
    const size = info.length
    const first = info[0]
    const author = first.playlist_uploader

    const children = info.map((entry: any, i: number) => {
      return {
        title: entry.title,
        author: entry.uploader,
        thumbnail: entry.thumbnail,
        url: entry.webpage_url,
        subId: i,
        formats: mapFormats(entry.formats),
      }
    })
    return {
      url,
      title: `${author} - ${first.playlist} - ${size} tracks`,
      author,
      thumbnail: first.thumbnail,
      children,
      length: children.length,
    }
  },
  true
)
