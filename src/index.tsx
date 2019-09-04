import { Provider } from 'mobx-react'
import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import commonStore from './stores/commonStore'
import { log } from './utils/logger'

import './index.css'

const electron = window.require('electron')
const { ipcRenderer } = electron

const stores = {
  commonStore,
}

ipcRenderer.on('response', (e: any, ...args: any) => {
  log('received: response', e, args)
})

ipcRenderer.send('request', 'ping')

ReactDOM.render(
  <Provider {...stores}>
    <App />
  </Provider>,
  document.getElementById('root')
)
