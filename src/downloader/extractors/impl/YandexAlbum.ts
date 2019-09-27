import { log } from '../../../utils/logger'
import { mapFormats } from '../../utils/utils'
import DefaultExtractor from '../DefaultExtractor'

export default new DefaultExtractor(
  'yandex-album',
  new RegExp('^https://music.yandex.ru/album/([A-Za-z0-9-]{1,40})$'),
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
        formats: [
          {
            filesize: entry.filesize,
            ext: entry.ext,
            format_id: entry.format_id,
            format: entry.format,
            format_note: entry.format_note,
          },
        ],
      }
    })
    return {
      url,
      title: `${author} - ${first.playlist} - ${size} tracks`,
      author,
      thumbnail: first.thumbnail,
      children,
    }
  },
  true
)
