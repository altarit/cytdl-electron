import { log } from '../../../utils/logger'
import { mapFormats } from '../../utils/utils'
import DefaultExtractor from '../DefaultExtractor'

export default new DefaultExtractor(
  'yandex-track',
  new RegExp('^https://music.yandex.ru/album/([A-Za-z0-9-]{1,40})/track/[A-Za-z0-9\\-]{1,60}$'),
  (info: any, url: string) => {
    const regexp = new RegExp(
      '^https://music.yandex.ru/album/([A-Za-z0-9-]{1,40})/track/[A-Za-z0-9\\-]{1,60}$'
    )
    const author = url.match(regexp)![1] || 'unknown'
    return {
      url,
      title: info.title,
      author,
      thumbnail: info.thumbnail,
      formats: [
        {
          filesize: info.filesize,
          ext: info.ext,
          format_id: info.format_id,
          format: info.format,
          format_note: info.format_note,
        },
      ],
    }
  }
)
