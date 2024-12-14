import React from 'react'
import {parseUrl} from '@/utils/url'
import './index.scss'
import * as content from '@/hooks/useContent'

function getIdFromUrl() {
  return parseInt(parseUrl().query?.id)
}

export async function init(payload) {
  if(!payload) payload=await content.fetchDetail(getIdFromUrl())
  content.updateContent(payload)
}

export function Page({isFetching, isError, isDone, retryFunc}) {
  return <div className='__view_scope'>
    <&=@/services/Content
      isDetailView
      displayLoading={isFetching}
      displayRetry={isError}
      retryFunc={retryFunc}
      id={getIdFromUrl()}
    />
  </div>
}
