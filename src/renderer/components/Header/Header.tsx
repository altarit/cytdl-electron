import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'

import commonStore, { CommonStore } from '../../stores/commonStore'

const youtubedl = window.require('youtube-dl')
const electron = window.require('electron')
const { ipcRenderer } = electron

interface HeaderProps {
  commonStore: CommonStore
}

@inject('commonStore')
@observer
export default class Header extends Component<HeaderProps> {
  public static defaultProps = {
    commonStore: {},
  }

  public handleIncrement = () => commonStore.incrementCounter()
  public handleReset = () => commonStore.setCounter(0)
  public handleSend = () => {
    console.log('send...')
    ipcRenderer.send('request', { q: 1, w: '2', e: ['3', 4, {}] })

    const video = youtubedl('http://www.youtube.com/watch?v=90AiXO1pAiA', ['--format=18'], {
      cwd: __dirname,
    })

    // Will be called when the download starts.
    video.on('info', function(info: any) {
      console.log('Download started')
      console.log('filename: ' + info._filename)
      console.log('size: ' + info.size)
    })
  }

  public render() {
    const { appName, counter } = this.props.commonStore
    return (
      <div>
        <div>{appName}</div>
        <div>{counter}</div>
        <button onClick={this.handleReset}>Reset</button>
        <button onClick={this.handleIncrement}>Increment</button>
        <button onClick={this.handleSend}>Send</button>
      </div>
    )
  }
}
