import { action, observable } from 'mobx'

const { app } = window.require('electron').remote

export class SettingsStore {
  @observable public outputPath = app.getPath('home')

  @action
  public setOutputPath(path: string) {
    this.outputPath = path
  }
}

export default new SettingsStore()
