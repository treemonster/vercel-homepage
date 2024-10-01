// @csrWidget
import React from 'react'
import './index.scss'
import {mount} from '@/utils/widget'

export default mount((props)=>{
  const [toast, set_toast]=React.useState(null)
  const [toastContent, set_toastContent]=React.useState(null)
  const [newone, set_newone]=React.useState(0)

  const {handler}=props
  handler.show=(x, duration=2e3)=>{
    set_toast(null)
    setTimeout(_=>{
      set_toastContent(x)
      set_toast(duration)
      set_newone(Math.random())
    }, 80)
  }

  React.useEffect(_=>{
    if(!toast) return;
    let valid=true
    setTimeout(_=>{
      if(!valid) return;
      set_toast(null)
    }, toast)
    return _=>valid=false
  }, [newone])

  return <div className={'__view_scope '+(toast? '': 'hide-toast')}>
    {toastContent}
  </div>
})
