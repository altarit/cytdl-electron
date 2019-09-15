import { Format, Preview } from '../../stores/previewStore'
import { log } from '../../utils/logger'

export default class DefaultExtractor {
  private _name: string
  private _regexp: RegExp
  private _extract: Function
  private _isMultiple: boolean

  constructor(name: string, regexp: RegExp, extract: Function, isMultiple: boolean = false) {
    this._name = name
    this._regexp = regexp
    this._extract = extract
    this._isMultiple = isMultiple
  }

  public get ename() {
    return this._name
  }

  public get regexp() {
    return this._regexp
  }

  public get isMultiple() {
    return this._name
  }

  public extract(info: any, url: string): Preview {
    const result = this._extract(info, url)
    log('extract', info, this._name, result)
    return result
  }
}
