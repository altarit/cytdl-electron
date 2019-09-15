import { inject, observer } from 'mobx-react'
import React, { PureComponent } from 'react'

import { CommonStore, Screen } from '../../stores/commonStore'
import { InputAreaStore } from '../../stores/inputAreaStore'
import { debug } from '../../utils/logger'

import './InputScreen.css'

interface InputScreenProps {
  inputAreaStore: InputAreaStore
  commonStore: CommonStore
}

@inject('inputAreaStore', 'commonStore')
@observer
export default class InputScreen extends PureComponent<InputScreenProps> {
  public static defaultProps = {
    commonStore: {},
    inputAreaStore: {},
  }

  public render() {
    debug('InputScreen.render')
    const { links, count, text } = this.props.inputAreaStore

    return (
      <div className="InputScreen">
        <textarea className="InputScreen_textarea" value={text} onChange={this.handleChangeText} />
        <div>Found links: {count}</div>
        <button onClick={this.handleSubmit} disabled={count === 0}>
          Next
        </button>
      </div>
    )
  }

  private handleChangeText = (e: any) => {
    this.props.inputAreaStore.setText(e.target.value)
  }

  private handleSubmit = () => {
    this.props.commonStore.setScreen(Screen.Preview)
  }
}
