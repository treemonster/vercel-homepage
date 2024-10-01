import React from 'react'
import './index.scss'
import {fetch} from '@/utils/fetch'

export async function fetchPayload() {
  return await fetch('/app/footer')
}

export default function({payload}) {
  if(!payload.data) return <&=@/services/LoadingPayload payload={payload} />
  const text=payload?.data?.md
  return <div className='__view_scope'>
    <&=@/services/Container children={
      <&=@/services/AppInfo
        text={text}
        action='/app/saveFooter'
      />}
    />
  </div>
}
