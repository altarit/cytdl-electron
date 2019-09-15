import { Preview } from '../stores/previewStore'
import { SettingsStore } from '../stores/settingsStore'
import { debug } from '../utils/logger'
import SocketAdapter from './network/SocketAdapter'
import { generateDateId } from './utils/utils'

interface LocalState {
  socketAdapter?: SocketAdapter
  requestId: string
}

const local: LocalState = {
  socketAdapter: undefined,
  requestId: generateDateId(),
}

export function getInfo(urls: string[]) {
  debug('getInfo', urls)

  if (!local.socketAdapter) {
    local.socketAdapter = new SocketAdapter({}, local.requestId)
  }

  local.socketAdapter.requestMetadata(urls)
}

export function requestDownloading(preview: Preview, opts: SettingsStore) {
  debug('requestDownloading', preview)

  if (!local.socketAdapter) {
    local.socketAdapter = new SocketAdapter({}, local.requestId)
  }

  local.socketAdapter.requestProcessing(local.requestId, preview, opts)
}
