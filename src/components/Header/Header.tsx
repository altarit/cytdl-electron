import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'

import commonStore, { CommonStore } from '../../stores/commonStore'
import { log } from '../../utils/logger'

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
    log('send...')
    ipcRenderer.send('request', { q: 1, w: '2', e: ['3', 4, {}] })
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
