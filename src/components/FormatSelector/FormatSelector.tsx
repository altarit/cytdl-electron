import { inject, observer } from 'mobx-react'
import React, { PureComponent } from 'react'

import { PopupsStore } from '../../stores/popupsStore'
import { Format, Preview } from '../../stores/previewStore'
import { PreviewStore } from '../../stores/previewStore'
import { debug, error } from '../../utils/logger'

import './FormatSelector.css'

interface FormatSelectorProps {
  popupsStore: PopupsStore
  previewStore: PreviewStore
}

const additionalFormats = [
  {
    ext: 'mp3',
    format: 'Best quality mp3',
    format_id: 'bq_mp3',
    special: true,
  },
]

@inject('popupsStore', 'previewStore')
@observer
export default class FormatSelector extends PureComponent<FormatSelectorProps> {
  public static defaultProps = {
    popupsStore: {},
    previewStore: {},
  }

  public render() {
    const { closeAllPopups, formatPopup } = this.props.popupsStore

    debug('FormatSelector.render', this.props.popupsStore)

    if (!formatPopup.isOpen) {
      return null
    }

    return (
      <div className="FormatSelector">
        <div className="FormatSelect__popup">
          <div className="FormatSelect__options">
            {formatPopup.formats && formatPopup.formats.map(this.renderOption)}
          </div>
          <div className="FormatSelect__options">
            {additionalFormats.map(this.renderOption)}
          </div>
        </div>
      </div>
    )
  }

  public renderOption = (option: Format) => {
    const { previewStore, popupsStore } = this.props
    const { id } = popupsStore.formatPopup

    return (
      <div key={option.format_id} onClick={e => this.handleFormatSelect(e, option, id)}>
        {option.ext + ' - ' + option.format}
      </div>
    )
  }

  public handleFormatSelect = (e: any, option: Format, id?: string) => {
    debug('#handleFormatSelect')
    e.stopPropagation()

    if (!id) {
      error('handleFormatSelect: id is empty')
    }

    this.props.previewStore.selectPreviewFormat(id!, option)
    this.props.popupsStore.closeAllPopups()

    return null
  }
}
