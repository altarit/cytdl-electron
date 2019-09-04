import { inject, observer } from 'mobx-react'
import React, { PureComponent } from 'react'

import { InputAreaStore } from '../../stores/inputAreaStore'
import { log } from '../../utils/logger'

interface PreviewScreenProps {
  inputAreaStore: InputAreaStore
}

@inject('inputAreaStore')
@observer
export default class PreviewScreen extends PureComponent<PreviewScreenProps> {
  public static defaultProps = {
    inputAreaStore: {},
  }

  public render() {
    log('PreviewScreen.render')
    const { links, count } = this.props.inputAreaStore

    return (
      <div className="PreviewScreen">
        <div>Count: {count}</div>
        {links.map(link => (
          <div key={link}>{link}</div>
        ))}
      </div>
    )
  }

  private handleChangeText = (e: any) => {
    this.props.inputAreaStore.setText(e.target.value)
  }
}
