import { action, observable } from 'mobx'

interface FormatPopup {
  isOpen: boolean
  formats?: any[]
  id?: string
}

export class PopupsStore {
  @observable public formatPopup: FormatPopup = {
    formats: undefined,
    id: undefined,
    isOpen: false,
  }

  @action
  public openFormatPopup(id: string, formats: any[]) {
    this.formatPopup.isOpen = true
    this.formatPopup.formats = formats
    this.formatPopup.id = id
  }

  @action
  public closeAllPopups() {
    this.formatPopup.isOpen = false
    this.formatPopup.formats = undefined
  }
}

export default new PopupsStore()
