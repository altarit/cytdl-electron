import { action, computed, observable } from 'mobx'

import { log } from '../utils/logger'
import { LINK_REGEXP } from '../utils/regexp'

export class InputAreaStore {
  @observable public text = ''

  @action
  public setText(val: string) {
    this.text = val
  }

  @computed
  public get links(): string[] {
    const links = this.text.match(LINK_REGEXP) || []
    log('@links: ', links.length)
    return links.filter((el, i) => links.indexOf(el) === i)
  }

  @computed
  public get count(): number {
    log('@count: ', this.links.length)
    return this.links.length
  }
}

export default new InputAreaStore()
