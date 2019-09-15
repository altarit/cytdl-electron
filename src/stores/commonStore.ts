import { action, observable } from 'mobx'

export enum Screen {
  Input,
  Preview,
}

export class CommonStore {
  @observable public appName = 'Cytdl'
  @observable public counter: number = 0
  @observable public screen = Screen.Input

  @action
  public incrementCounter() {
    this.counter++
  }

  @action
  public setCounter(val: number) {
    this.counter = val
  }

  @action
  public setScreen(val: Screen) {
    this.screen = val
  }
}

export default new CommonStore()
