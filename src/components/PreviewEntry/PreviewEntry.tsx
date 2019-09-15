import { inject, observer } from 'mobx-react'
import React, { PureComponent } from 'react'

import { Format, Preview, PreviewStore } from '../../stores/previewStore'
import { debug } from '../../utils/logger'

import './PreviewEntry.css'

interface PreviewProps {
  preview: Preview
  onClickFormats: Function
  onClickDownload: Function
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
              <div className="PreviewEntry_title">{preview.title}</div>
            )}
            <div className="PreviewEntry_progressbar">{preview.status.name}</div>
            <div className="PreviewEntry_control" onClick={this.handleOpenFormatsPopup}>
              {preview.author} {preview.selected && preview.selected.format_id}{' '}
              {preview.formats && preview.formats.length}
              <button onClick={this.handleDownloadClick}>Download</button>
            </div>
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
}
