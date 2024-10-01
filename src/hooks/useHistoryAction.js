import React from 'react'
import {useShareState, defineShareState, getShareStateValue} from '@/hooks/useShareState'
import {buildUrl} from '@/utils/url'
const HISTORY_ACTION_KEY='useHistoryAction_key'
const HISTORY_VERSION=Date.now()
export default function() {
  defineShareState(HISTORY_ACTION_KEY, _=>{
    const initAction={
      t: 0,
      isInit: true,
      isIn: false,
      isOut: false,
      isInReplace: false,
      version: HISTORY_VERSION,
    }
    window.addEventListener('popstate', e=>{
      updateActionType(e.state || initAction, false)
    }, false)
    return initAction
  })
  const [actionType, set_actionType]=useShareState(HISTORY_ACTION_KEY)
  const updateActionType=(e, isNew)=>{
    const actionType=getShareStateValue(HISTORY_ACTION_KEY)
    if(isNew) {
      set_actionType({
        t: e.t,
        isInit: false,
        isIn: true,
        isOut: false,
        isInReplace: e.action==='replace',
      })
    }else{
      set_actionType({
        t: e.t,
        isInit: false,
        isIn: e.t>actionType.t || HISTORY_VERSION!==e.version || e.t===0,
        isOut: e.t<actionType.t,
        isInReplace: false,
      })
    }
  }
  const pushUrl=(x, params)=>{
    const e={
      t: Date.now(),
      action: 'push',
      version: HISTORY_VERSION,
    }
    history.pushState(e, null, buildUrl(x, params))
    updateActionType(e, true)
  }
  const replaceUrl=(x, params)=>{
    const e={
      t: Date.now(),
      action: 'replace',
      version: HISTORY_VERSION,
    }
    history.replaceState(e, null, buildUrl(x, params))
    updateActionType(e, true)
  }
  const goBack=_=>{
    history.back()
  }
  const goForward=_=>{
    history.forward()
  }
  return [actionType, {pushUrl, replaceUrl, goBack, goForward}]
}
