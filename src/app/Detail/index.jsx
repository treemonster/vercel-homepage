import React from 'react'
import {parseUrl} from '@/utils/url'
import {fetch} from '@/utils/fetch'
import './index.scss'

export async function fetchPayload() {
  return await fetch('/content/detail', {id: parseUrl().query?.id})
}

export default function({payload}) {
  return <div className='__view_scope'>
    <&=@/services/Content type='large' detail={payload.data} />
  </div>
}
