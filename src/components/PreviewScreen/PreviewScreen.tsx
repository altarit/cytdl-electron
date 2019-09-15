import { inject, observer } from 'mobx-react'
import React, { PureComponent } from 'react'

import { getInfo, requestDownloading } from '../../downloader'
import { CommonStore, Screen } from '../../stores/commonStore'
import { InputAreaStore } from '../../stores/inputAreaStore'
import { PopupsStore } from '../../stores/popupsStore'
import { Format, Preview, PreviewStore } from '../../stores/previewStore'
import { SettingsStore } from '../../stores/settingsStore'
import { debug } from '../../utils/logger'
import PreviewEntry from '../PreviewEntry'

import './PreviewScreen.css'

const { shell } = window.require('electron').remote

interface PreviewScreenProps {
  commonStore: CommonStore
  inputAreaStore: InputAreaStore
  previewStore: PreviewStore
  popupsStore: PopupsStore
  settingsStore: SettingsStore
}

@inject('inputAreaStore', 'commonStore', 'previewStore', 'popupsStore', 'settingsStore')
@observer
export default class PreviewScreen extends PureComponent<PreviewScreenProps> {
  public static defaultProps = {
    commonStore: {},
    inputAreaStore: {},
    previewStore: {},
    popupsStore: {},
    settingsStore: {},
  }

  public componentDidMount(): void {
    getInfo(this.props.inputAreaStore.links)
  }

  public render() {
    debug('PreviewScreen.render')
    const { previews, count: previewsCount } = this.props.previewStore

    return (
      <div className="PreviewScreen">
        <button onClick={this.handleBack}>Back</button>

        <div>Count: {previewsCount}</div>
        <div className="PreviewScreen__list">
          {previews.map((preview: Preview) => {
            return (
              <PreviewEntry
                key={preview.id}
                preview={preview}
                onClickFormats={this.handleOpenFormatsPopup}
                onClickDownload={this.handleDownloadClick}
                onClickOpenDirectory={this.handleClickOpenDirectory}
              />
            )
          })}
        </div>
      </div>
    )
  }

  private handleBack = () => {
    this.props.previewStore.clearAll()
    this.props.commonStore.setScreen(Screen.Input)
  }

  private handleOpenFormatsPopup = (id: string, formats: Format[]) => {
    this.props.popupsStore.openFormatPopup(id, formats)
  }

  private handleDownloadClick = (val: Preview) => {
    const { settingsStore } = this.props
    debug('####', val.id)
    requestDownloading(val, settingsStore)
  }

  private handleClickOpenDirectory = () => {
    const { outputPath } = this.props.settingsStore

    shell.openItem(outputPath)
  }
}
