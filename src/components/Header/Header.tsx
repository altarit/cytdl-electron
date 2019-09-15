import { inject, observer } from 'mobx-react'
import React, { PureComponent } from 'react'

import { CommonStore } from '../../stores/commonStore'
import { debug } from '../../utils/logger'

import './Header.css'

const { ipcRenderer } = window.require('electron')

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
      <div className="Header">
        <h1>{appName}</h1>
        {/*<button onClick={this.handleReset}>Reset</button>*/}
        {/*<button onClick={this.handleIncrement}>Increment</button>*/}
        {/*<button onClick={this.handleSend}>Send</button>*/}
      </div>
    )
  }

  private handleIncrement = () => this.props.commonStore.incrementCounter()
  private handleReset = () => this.props.commonStore.setCounter(0)
  private handleSend = () => {
    debug('send...')
    ipcRenderer.send('request', { text: 'ping' })
  }
}
