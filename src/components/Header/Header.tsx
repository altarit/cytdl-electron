import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';

import commonStore, {CommonStore} from '../../stores/commonStore';

const electron = window.require('electron')
const { ipcRenderer } = electron;

interface HeaderProps {
  commonStore: CommonStore
}

@inject('commonStore')
@observer
export default class Header extends Component<HeaderProps> {
  handleIncrement = () => commonStore.incrementCounter()
  handleReset = () => commonStore.setCounter(0)
  handleSend = () => {
    console.error('send...')
    ipcRenderer.send('request', {q: 1, w: '2', e: ['3', 4, {}]})
  }

  static defaultProps = {
    commonStore: {}
  }

  render() {
    const { appName, counter } = this.props.commonStore;
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
