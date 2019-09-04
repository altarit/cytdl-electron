import { action, observable, reaction } from 'mobx'

export class CommonStore {
  @observable public appName = 'Cytdl'
  @observable public counter: number = 0

  @action public incrementCounter() {
    this.counter++
  }

  @action public setCounter(val: number) {
    this.counter = val
  }
}

export default new CommonStore()
