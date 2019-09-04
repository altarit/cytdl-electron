import { inject, observer } from 'mobx-react'
import React, { PureComponent } from 'react'

import { InputAreaStore } from '../../stores/inputAreaStore'
import { log } from '../../utils/logger'

interface InputScreenProps {
  inputAreaStore: InputAreaStore
}

@inject('inputAreaStore')
@observer
export default class InputScreen extends PureComponent<InputScreenProps> {
  public static defaultProps = {
    inputAreaStore: {},
  }

  public render() {
    log('InputScreen.render')
    const { links, count } = this.props.inputAreaStore

    return (
      <div className="InputScreen">
        <textarea className="InputScreen_textarea" onChange={this.handleChangeText} />
        <div>Count: {count}</div>
        <div>Links: {links}</div>
      </div>
    )
  }

  private handleChangeText = (e: any) => {
    this.props.inputAreaStore.setText(e.target.value)
  }
}
