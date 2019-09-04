import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react';

import App from './App'
import commonStore from './stores/commonStore';

import './index.css'

const electron = window.require('electron')
const { ipcRenderer } = electron;

const stores = {
  commonStore
};

ipcRenderer.on('response', (e: any, ...args: any) => {
    console.log('received: response', e, args)
});

ipcRenderer.send('request', 'ping')

ReactDOM.render((
  <Provider {...stores}>
    <App />
  </Provider>
), document.getElementById('root'))
