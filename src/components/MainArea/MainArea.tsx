import { inject, observer } from 'mobx-react'
import React, { PureComponent } from 'react'

import { CommonStore, Screen } from '../../stores/commonStore'
import InputScreen from '../InputScreen'
import PreviewScreen from '../PreviewScreen'

import './MainArea.css'

interface MainAreaProps {
  commonStore: CommonStore
}

@inject('commonStore')
@observer
export default class MainArea extends PureComponent<MainAreaProps> {
  public static defaultProps = {
    commonStore: {},
  }

  public render() {
    return <div className="MainArea">{this.renderScreen()}</div>
  }

  public renderScreen() {
    const { screen } = this.props.commonStore

    if (screen === Screen.Input) {
      return <InputScreen />
    } else if (screen === Screen.Preview) {
      return <PreviewScreen />
    }

    return <div>404</div>
  }
}
