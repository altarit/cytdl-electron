import { action, computed, observable } from 'mobx'

import { debug, error } from '../utils/logger'

export interface Format {
  filesize?: number
  ext: string
  special?: boolean
  format_id: string
  format?: string
  format_note?: string
}

export interface Preview {
  id: string
  subId: string
  url: string
  title?: string
  author?: string
  status: any
  selected?: Format
  requestId?: any
  thumbnail?: string
  formats: Format[]
  children?: Preview[]
}

export class PreviewStore {
  @computed
  public get count(): number {
    return this.previews.length
  }
  // @observable public previews: Map<string, Preview> = new Map()
  @observable public previews: Preview[] = []

  @action
  public addPreview(val: Preview) {
    debug('PreviewStore.addPreview', val)
    const preview = this.findPreviewById(val.id)

    if (preview) {
      Object.assign(preview, val)
    } else {
      this.previews.push(val)
    }
  }

  @action
  public selectPreviewFormat(id: string, val: Format) {
    debug('PreviewStore.editPreview', val)
    const preview = this.findPreviewById(id)

    if (preview) {
      preview.selected = val
    } else {
      error('PreviewStore.selectPreviewFormat: Entry not found.')
    }
  }

  private findPreviewById(id: string) {
    const ids = id.split('.')
    let array = this.previews
    for (let i = 0; i < ids.length; i++) {
      const found = array.find(pre => pre.subId === ids[i])

      if (!found) {
        return null
      }

      if (i === ids.length - 1) {
        return found
      }

      if (!found.children) {
        return null
      } else {
        array = found.children
      }
    }
  }
}

export default new PreviewStore()
