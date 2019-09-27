import previewStore, { Preview } from '../../stores/previewStore'
import { SettingsStore } from '../../stores/settingsStore'
import { log } from '../../utils/logger'
import PREVIEW_STATUS from '../constants/previewStatus'
import DownloaderFacade from '../core/DownloaderFacade'

export default class SocketAdapter {
  private active: boolean = true
  private downloaderFacade: any

  constructor(private client: any, private requestId: string) {
    const self = this

    const proxy = new Proxy(this, {
      get(target: any, propKey: string, receiver) {
        console.log(`Callback ${propKey} was intercepted for ${requestId}`)

        if (!self.active) {
          return (...args: any[]) => {
            console.log(`Deactivated.`)
            return null
          }
        }

        const origMethod = target[propKey]
        return (...args: any[]) => {
          const result = origMethod.apply(self, args)
          return result
        }
      },
    })

    this.downloaderFacade = new DownloaderFacade(proxy)
  }

  public requestMetadata(previews: any[]) {
    this.downloaderFacade.requestMetadata(this.requestId, previews)
  }

  public requestProcessing(requestId: string, entry: Preview, opts: SettingsStore) {
    this.downloaderFacade.requestProcessing(requestId, entry, opts)
  }

  public deactivate() {
    log(`Deactivated socket adapter '${this.requestId}'`)
    this.active = false
  }

  public onMetadataValidated(requestId: string, i: number, type: any, url: string) {
    const preview = {
      id: `${i}`,
      subId: `${i}`,
      url,
      title: '',
      status: PREVIEW_STATUS.RECEIVING_METADATA,
      formats: [],
      requestId,
    }

    log('onMetadataValidated', preview)
    previewStore.addPreview(preview)
  }

  public onMetadataSuccess(requestId: string, i: number, info: any) {
    const preview = {
      id: `${i}`,
      subId: `${i}`,
      url: info.url,
      title: info.title,
      author: info.author,
      status: PREVIEW_STATUS.READY,
      requestId,
      formats: info.formats,
      thumbnail: info.thumbnail,
      children: info.children
        ? info.children.map((el: any, subId: number) =>
            Object.assign(el, {
              id: `${i}.${subId}`,
              subId: `${subId}`,
              status: PREVIEW_STATUS.READY,
              requestId,
              formats: el.formats,
              enabled: true,
            })
          )
        : null,
    }

    previewStore.editPreview(preview.id, preview)
  }

  public onMetadataError(requestId: string, err: any, i: number, url: string) {
    console.error(`onMetadataError:`, err)

    const preview = {
      id: `${i}`,
      subId: `${i}`,
      url,
      title: err.message,
      status: PREVIEW_STATUS.RECEIVING_METADATA,
      formats: [],
      requestId,
    }

    log('onMetadataError', preview)
    previewStore.editPreview(preview.id, preview)
  }

  public onProcessingProgress(requestId: string, entry: any, status: any, progress: any) {
    const preview = {
      id: entry.id,
      subId: entry.subId,
      status,
      statusText: progress,
    }

    log('onProcessingProgress', progress)
    previewStore.editPreview(preview.id, preview)
  }

  public onProcessingSuccess(requestId: string, entry: any, finalFilePath: string) {
    const preview = {
      id: entry.id,
      subId: entry.subId,
      status: PREVIEW_STATUS.COMPLETED,
      href: finalFilePath,
      title: entry.title,
    }

    log('onProcessingSuccess', finalFilePath)
    previewStore.editPreview(preview.id, preview)
  }

  public onProcessingError(requestId: string, err: any, entry: any) {
    console.error(`onProcessingError: ${err.message}`, err)
    const preview = {
      id: entry.id,
      subId: entry.subId,
      status: err.status || PREVIEW_STATUS.UNKNOWN_ERROR,
    }

    log('onProcessingError', err)
    previewStore.editPreview(preview.id, preview)
  }
}
