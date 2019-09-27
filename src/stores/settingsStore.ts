import { action, observable } from 'mobx'

const { app } = window.require('electron').remote

export class SettingsStore {
  @observable public outputPath = app.getPath('home')
  @observable public tempPath = app.getPath('temp')

  @action
  public setOutputPath(path: string) {
    this.outputPath = path
  }
}

export default new SettingsStore()
