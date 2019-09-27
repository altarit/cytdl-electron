import { log } from '../../../utils/logger'
import { mapFormats } from '../../utils/utils'
import DefaultExtractor from '../DefaultExtractor'

export default new DefaultExtractor(
  'yandex-track',
  new RegExp('^https://yadi.sk/i/[A-Za-z0-9\\-]{1,60}$'),
  (info: any, url: string) => {
    log(info)
    const author = 'wqe'
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
