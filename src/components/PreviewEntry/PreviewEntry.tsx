import { inject, observer } from 'mobx-react'
import React, { PureComponent } from 'react'

import { Format, Preview, PreviewStore } from '../../stores/previewStore'
import { debug } from '../../utils/logger'

import './PreviewEntry.css'

interface PreviewProps {
  preview: Preview
  onClickFormats: Function
  onClickDownload: Function
  onClickOpenDirectory: Function
}

@observer
export default class PreviewEntry extends PureComponent<PreviewProps> {
  public render() {
    const { preview } = this.props

    debug('PreviewEntry.render', preview)

    return (
      <div className="PreviewEntry">
        <div className="PreviewEntry_current">
          <div className="PreviewEntry_thumbnail">
            <a href={preview.url} target="_blank">
              {preview.thumbnail ? (
                <img src={preview.thumbnail} alt="logo" className="PreviewEntry_thumbnail-image" />
              ) : (
                <p>'Logo'</p>
              )}
            </a>
          </div>
          <div className="PreviewEntry_info">
            {!preview.title ? (
              <div className="PreviewEntry_link">
                <a href={preview.url} target="_blank">
                  {preview.url}
                </a>
              </div>
            ) : (
              <div className="PreviewEntry_title">
                {preview.title}
              </div>
            )}
            <div className="PreviewEntry_progressbar">
              {preview.statusText || preview.status.name}
            </div>
            {!preview.children && preview.status && [3, 10, 22, 23].includes(preview.status.id) && (
              <div className="PreviewEntry_control" onClick={this.handleOpenFormatsPopup}>
                {preview.selected ? (
                  <button className="PreviewEntry__format-selected">
                    {preview.selected.ext + ' - ' + preview.selected.format}
                  </button>
                ) : (
                  <button className="PreviewEntry__format-select-button">
                    Select format
                  </button>
                )}
                {preview.status && preview.status.id === 10 && (
                  <button onClick={this.handleClickOpenDirectory}>
                    Open directory
                  </button>
                )}
                <button onClick={this.handleDownloadClick} disabled={!preview.selected}>
                  Download
                </button>
              </div>
            )}
          </div>
        </div>
        {preview.children &&
          Array.from(preview.children.entries()).map(([subId, subPreview]) => {
            return (
              <PreviewEntry
                key={subId}
                preview={subPreview}
                onClickFormats={this.props.onClickFormats}
                onClickDownload={this.props.onClickDownload}
                onClickOpenDirectory={this.props.onClickOpenDirectory}
              />
            )
          })}
      </div>
    )
  }

  private handleOpenFormatsPopup = (e: any) => {
    debug('#handleOpenFormatsPopup')
    e.stopPropagation()
    this.props.onClickFormats(this.props.preview.id, this.props.preview.formats)
  }

  private handleDownloadClick = (e: any) => {
    debug('#handleDownloadClick')
    e.stopPropagation()
    this.props.onClickDownload(this.props.preview)
  }

  private handleClickOpenDirectory = (e: any) => {
    debug('#onClickOpenDirectory')
    e.stopPropagation()
    this.props.onClickOpenDirectory()
  }
}
