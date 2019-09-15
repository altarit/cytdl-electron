import { mapFormats } from '../../utils/utils'
import DefaultExtractor from '../DefaultExtractor'

export default new DefaultExtractor(
  'bandcamp-album',
  new RegExp('^https://([A-Za-z0-9-]{1,40}).bandcamp.com/album/[A-Za-z0-9_\\-]{1,60}$'),
  (info: any, url: string) => {
    const size = info.length
    const first = info[0]
    const author = first.playlist_uploader_id

    const children = info.map((entry: any, i: number) => {
      return {
        title: entry.title,
        author: entry.playlist_uploader_id,
        thumbnail: entry.thumbnail,
        url: entry.webpage_url,
        subId: i,
        formats: mapFormats(entry.formats),
      }
    })
    return {
      title: `${author} - ${first.playlist} - ${size} tracks`,
      author,
      thumbnail: first.thumbnail,
      children,
      url: url,
    }
  },
  true
)
