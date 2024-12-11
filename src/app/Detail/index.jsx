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

export function Loading() {
  return <Detail displayLoading={true} />
}

export default function Detail(props) {
  return <div className='__view_scope'>
    <&=@/services/Content
      isDetailView
      displayLoading={props.displayLoading}
      id={getIdFromUrl()}
    />
  </div>
}
