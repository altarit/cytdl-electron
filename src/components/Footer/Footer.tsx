import { inject, observer } from 'mobx-react'
import React, { PureComponent } from 'react'

import { SettingsStore } from '../../stores/settingsStore'
import { debug, log } from '../../utils/logger'

import './Footer.css'

const { dialog, shell } = window.require('electron').remote

interface FooterProps {
  settingsStore: SettingsStore
}

@inject('settingsStore')
@observer
export default class Footer extends PureComponent<FooterProps> {
  public static defaultProps = {
    settingsStore: {},
  }

  public render() {
    debug('Footer.render')
    const { outputPath } = this.props.settingsStore

    return (
      <div className="Footer">
        <span className="Footer__path">Path: {outputPath}</span>
        <button onClick={this.handleClickOpen}>Open</button>
        <button onClick={this.handleSend}>Change</button>
      </div>
    )
  }

  private handleSend = () => {
    dialog.showOpenDialog({ properties: ['openDirectory'] }).then((dialogResult: any) => {
      const { filePaths } = dialogResult

      if (filePaths.length) {
        this.props.settingsStore.setOutputPath(filePaths[0])
      }
    })
  }

  private handleClickOpen = () => {
    const { outputPath } = this.props.settingsStore

    shell.openItem(outputPath)
  }
}
