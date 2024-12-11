import React from 'react'
import './index.scss'
import {fetch} from '@/utils/fetch'
import * as appInfo from '@/hooks/useAppInfo'

export async function init(payload) {
  if(!payload) payload=await fetch('/app/footer')
  appInfo.FooterText.set(payload?.md || '')
  return payload
}

export default function() {
  return <div className='__view_scope'>
    <div className='app-container'>
      <&=@/services/AppInfo
        textStore={appInfo.FooterText}
        action='/app/saveFooter'
      />
    </div>
  </div>
}
