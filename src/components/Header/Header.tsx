import { inject, observer } from 'mobx-react'
import React, { PureComponent } from 'react'

import { CommonStore } from '../../stores/commonStore'
import { log } from '../../utils/logger'

const electron = window.require('electron')
const { ipcRenderer } = electron

interface HeaderProps {
  commonStore: CommonStore
}

@inject('commonStore')
@observer
export default class Header extends PureComponent<HeaderProps> {
  public static defaultProps = {
    commonStore: {},
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

  private handleIncrement = () => this.props.commonStore.incrementCounter()
  private handleReset = () => this.props.commonStore.setCounter(0)
  private handleSend = () => {
    log('send...')
    ipcRenderer.send('request', { q: 1, w: '2', e: ['3', 4, {}] })
  }
}
