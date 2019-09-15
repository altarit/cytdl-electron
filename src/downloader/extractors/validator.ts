import { log } from '../../utils/logger'
import DownloaderError from '../errors/DownloaderError'
import DefaultExtractor from './DefaultExtractor'

import extractors from './impl'

interface IDictionary<TValue> {
  [id: string]: TValue
}

const PATTERNS_ARRAY: DefaultExtractor[] = extractors

const PATTERNS_MAP: IDictionary<DefaultExtractor> = {}
for (const pattern of PATTERNS_ARRAY) {
  PATTERNS_MAP[pattern.ename] = pattern
}

export function getExtractorByNameAndCheck(url: string, name: string) {
  return Promise.resolve().then(() => {
    if (!name) {
      throw new Error(`Parameter name is empty`)
    }

    const extractor = PATTERNS_MAP[name]
    if (!extractor) {
      throw new Error(`Extractor ${name} not found`)
    }
    if (extractor.regexp.test(url)) {
      return extractor
    }

    throw new Error(`Url ${url} doesn't match ${name} pattern`)
  })
}

export function getExtractorByUrl(url: string) {
  return Promise.resolve().then(() => {
    for (const extractor of PATTERNS_ARRAY) {
      if (extractor.regexp.test(url)) {
        return extractor
      }
    }
    throw new DownloaderError(`Url ${url} doesn't match any patterns`, `Invalid url`)
  })
}

export default {
  getExtractorByNameAndCheck,
  getExtractorByUrl,
}
