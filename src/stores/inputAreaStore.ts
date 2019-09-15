import { action, computed, observable } from 'mobx'

import { LINK_REGEXP } from '../utils/regexp'

export class InputAreaStore {
  @observable public text = `
https://www.youtube.com/watch?v=uF2TxT6u6cY
https://4everfreebrony.bandcamp.com/track/who-knows-feat-milkmomo-eilemonty-memj0123
https://www.youtube.com/playlist?list=PLHU8QTqz8ElOmVrfpdKXf0nJ7z89boahd
  `

  @action
  public setText(val: string) {
    this.text = val
  }

  @computed
  public get links(): string[] {
    const links = this.text.match(LINK_REGEXP) || []
    return links.filter((el, i) => links.indexOf(el) === i)
  }

  @computed
  public get count(): number {
    return this.links.length
  }
}

export default new InputAreaStore()
