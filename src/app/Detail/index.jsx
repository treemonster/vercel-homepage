import React from 'react'
import {parseUrl} from '@/utils/url'
import './index.scss'
import * as content from '@/hooks/useContent'

export async function init(payload) {
  if(!payload) payload=await content.fetchDetail(parseUrl().query?.id)
  content.updateContent(payload)
}

export default function() {
  return <div className='__view_scope'>
    <&=@/services/Content isDetailView id={parseUrl().query?.id} />
  </div>
}
