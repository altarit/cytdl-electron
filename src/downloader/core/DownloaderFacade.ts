import { Preview } from '../../stores/previewStore'
import { SettingsStore } from '../../stores/settingsStore'
import { log } from '../../utils/logger'
import DefaultExtractor from '../extractors/DefaultExtractor'
import validator from '../extractors/validator'
import SocketAdapter from '../network/SocketAdapter'
import downloader from './downloader'

export default class DownloaderFacade {
  public socketAdapter: SocketAdapter

  constructor(socketAdapter: any) {
    this.socketAdapter = socketAdapter
  }

  public requestMetadata(requestId: string, urls: any[]) {
    Promise.all(
      urls.map((current: string, i: number) => {
        return validator
          .getExtractorByUrl(current)
          .then((type: DefaultExtractor) => {
            this.socketAdapter.onMetadataValidated(requestId, i, type.ename, current)

            return downloader
              .requestMetadata(requestId, i, current, type)
              .then((info: any) => {
                this.socketAdapter.onMetadataSuccess(requestId, i, info)
              })
              .catch((err: Error) => {
                this.socketAdapter.onMetadataError(requestId, err, i, current)
              })
          })
          .catch(err => {
            this.socketAdapter.onMetadataError(requestId, err, i, current)
          })
      })
    )
      .then(previews => {
        log(`All metadata have been reviewed.`)
      })
      .catch(err => {
        log(`Error at receiving metadata.`, err)
      })
  }

  public requestProcessing(requestId: string, entry: Preview, opts: SettingsStore) {
    downloader
      .requestProcessing(
        entry,
        (status: any, progress: any) => {
          this.socketAdapter.onProcessingProgress(requestId, entry, status, progress)
        },
        opts
      )
      .then((result: any) => {
        const { finalFilePath } = result
        this.socketAdapter.onProcessingSuccess(requestId, entry, finalFilePath)
      })
      .catch((err: Error) => {
        this.socketAdapter.onProcessingError(requestId, err, entry)
      })
  }
}
