import React from 'react'
import {createStoreValue} from '@/hooks/useStore'

export const ReadOnly=createStoreValue(true)
export const HeaderText=createStoreValue(null)
export const HeaderLeftText=createStoreValue(null)
export const FooterText=createStoreValue(null)
export const Editing=createStoreValue(false)
export const JavascriptReady=createStoreValue(false)

const funcs=new Map
export function useUniqueLoading(key, isDone, callback) {
  if(!isDone) funcs.set(key, callback)
  const clear=_=>funcs.delete(key)
  React.useEffect(_=>clear, [])
  React.useEffect(_=>{
    if(isDone) clear()
  }, [isDone])

  const isFirst=[...funcs.values()][0]===callback
  const emitAll=_=>{
    for(const fn of [...funcs.values()]) fn()
    funcs.clear()
  }

  return [isFirst, emitAll]
}

const payloads={}
export function usePayload(key) {
  if(!payloads[key]) {
    payloads[key]=createStoreValue(null)
  }
  return payloads[key]
}
