import React, { PureComponent } from 'react'

import InputScreen from '../InputScreen/InputScreen'
import PreviewScreen from '../PreviewScreen/PreviewScreen'

export default class MainArea extends PureComponent {
  public render() {
    return (
      <div className="MainArea">
        <InputScreen />
        <PreviewScreen />
      </div>
    )
  }
}
