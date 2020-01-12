import React, { useState } from 'react'

import * as ContentTypes from '../../ContentTypes'
import Content, { ContentProps } from '../Content'
import { createDocumentLink, HypermergeUrl } from '../../ShareLink'
import { useDocument } from '../../Hooks'
import ListItem from '../ui/ListItem'
import Badge from '../ui/Badge'
import ContentDragHandle from '../ui/ContentDragHandle'
import TitleWithSubtitle from '../ui/TitleWithSubtitle'
import './ThreadContent.css'

interface Message {
  authorId: HypermergeUrl
  content: string
  time: number // Unix timestamp
}

interface Doc {
  title?: string
  messages: Message[]
  videoId?: string
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  localeMatcher: 'best fit',
  weekday: 'short',
  hour: '2-digit',
  minute: '2-digit',
  month: 'short',
  day: 'numeric',
})

YoutubeContent.minWidth = 9
YoutubeContent.minHeight = 6
YoutubeContent.defaultWidth = 16
YoutubeContent.defaultHeight = 18
YoutubeContent.maxWidth = 24
YoutubeContent.maxHeight = 36

export default function YoutubeContent(props: ContentProps) {
  const [videoId, setVideoId] = useState('')
  const [doc, changeDoc] = useDocument<Doc>(props.hypermergeUrl)

  if (!doc) {
    return null
  }

  function onInput(e: React.ChangeEvent<HTMLInputElement>) {
    setVideoId(e.target.value)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    e.stopPropagation()

    if (e.key === 'Enter' && videoId) {
      e.preventDefault()

      changeDoc((threadDoc: Doc) => {
        threadDoc.videoId = videoId
      })

      setVideoId('')
    }
  }

  const thumb = `https://i1.ytimg.com/vi/${doc.videoId}/mqdefault.jpg`

  return (
    <div className="threadWrapper">
      <div className="messageWrapper">
        <img src={thumb} width={320} height={180} alt="youtube thumb" />
      </div>
      <div className="inputWrapper">
        <input value={props.url} />
        <input
          className="messageInput"
          value={videoId}
          onKeyDown={onKeyDown}
          onChange={onInput}
          onPaste={stopPropagation}
          onCut={stopPropagation}
          onCopy={stopPropagation}
          placeholder="Youtube Link?"
        />
      </div>
    </div>
  )
}

export function ThreadInList(props: ContentProps) {
  const { hypermergeUrl, url } = props
  const [doc] = useDocument<Doc>(hypermergeUrl)
  if (!doc) return null

  const title = doc.title != null && doc.title !== '' ? doc.title : 'Untitled conversation'
  const subtitle = (doc.messages[doc.messages.length - 1] || { content: '' }).content
  const editable = true

  return (
    <ListItem>
      <ContentDragHandle url={url}>
        <Badge icon={icon} />
      </ContentDragHandle>
      <TitleWithSubtitle
        titleEditorField="title"
        title={title}
        subtitle={subtitle}
        hypermergeUrl={hypermergeUrl}
        editable={editable}
      />
    </ListItem>
  )
}

function stopPropagation(e: React.SyntheticEvent) {
  e.stopPropagation()
  e.nativeEvent.stopImmediatePropagation()
}

function create(unusedAttrs, handle) {
  handle.change((doc) => {
    doc.messages = []
  })
}

const icon = 'comments'

ContentTypes.register({
  type: 'youtube',
  name: 'YouTube',
  icon,
  contexts: {
    workspace: YoutubeContent,
    board: YoutubeContent,
    list: ThreadInList,
    'title-bar': ThreadInList,
  },
  create,
})
