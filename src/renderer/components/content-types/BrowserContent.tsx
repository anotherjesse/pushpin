import * as path from 'path'
import React, { useState, useRef, useEffect } from 'react'
import { IpcMessageEvent } from 'electron'

import * as ContentTypes from '../../ContentTypes'
import { APP_PATH } from '../../constants'
import { ContentProps } from '../Content'
import { useDocument, useEvent } from '../../Hooks'
import './ThreadContent.css'

interface Doc {
  title?: string
  url?: string
}

BrowserContent.minWidth = 9
BrowserContent.minHeight = 6
BrowserContent.defaultWidth = 16
BrowserContent.defaultHeight = 18
BrowserContent.maxWidth = 80
BrowserContent.maxHeight = 80

export default function BrowserContent(props: ContentProps) {
  const webviewRef = useRef(null)
  const [doc, changeDoc] = useDocument<Doc>(props.hypermergeUrl)
  const [newUrl, setNewUrl] = useState(doc ? doc.url : '')
  const webview = webviewRef.current
  // useEvent(webview, 'ipc-message', ({ channel, args }: IpcMessageEvent) => {
  //   console.log(channel)
  //   if (channel !== 'freeze-dry') return
  //   console.log(args)

  //   // const [hyperfileUrl] = args as [HyperfileUrl]
  //   // changeDoc((doc) => {
  //   //   doc.htmlHyperfileUrl = hyperfileUrl
  //   //   doc.capturedAt = new Date().toISOString()
  //   //   unfluffContent(doc, changeDoc)
  //   // })
  // })

  // useEvent(webview, 'console-message', ({ message }: { message: string }) => {
  //   console.log('webview.log:', message) // eslint-disable-line
  // })

  useEffect(() => {
    if (webview) {
      // FIXME(ja): this doesn't trigger the first time
      // FIXME(ja): and we should remove the listener if webview changes
      console.log('adding listener')

      webview.addEventListener('new-window', (e) => webview.loadURL(e.url))
    }
  }, [webview])

  if (!doc) {
    return null
  }

  function onInput(e: React.ChangeEvent<HTMLInputElement>) {
    setNewUrl(e.target.value)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    e.stopPropagation()

    if (e.key === 'Enter' && newUrl) {
      e.preventDefault()

      changeDoc((threadDoc: Doc) => {
        threadDoc.url = newUrl
      })
    }
  }
  // function freeze() {
  //   webview && (webview as any).send('freeze-dry', { type: 'Ready' })
  // }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div>
        {/* <i className="fa fa-save" onClick={freeze} /> */}

        <span>{doc.url}</span>
        <input
          style={{ flex: 'true', border: '1px solid #ccc', marginLeft: '10px' }}
          value={newUrl}
          onKeyDown={onKeyDown}
          onChange={onInput}
          onPaste={stopPropagation}
          onCut={stopPropagation}
          onCopy={stopPropagation}
          placeholder="https://"
        />
      </div>
      <webview src={doc.url} style={{ width: '100%', height: '100%' }} ref={webviewRef} />
    </div>
  )
}

function create(unusedAttrs, handle) {
  handle.change((doc) => {
    doc.url = 'https://example.com/'
  })
}

function stopPropagation(e: React.SyntheticEvent) {
  e.stopPropagation()
  e.nativeEvent.stopImmediatePropagation()
}

const icon = 'chrome'

ContentTypes.register({
  type: 'browser',
  name: 'Browser',
  icon,
  contexts: {
    workspace: BrowserContent,
    board: BrowserContent,
  },
  create,
})
