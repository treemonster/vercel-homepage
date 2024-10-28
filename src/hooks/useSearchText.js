import React from 'react'

import {parseUrl} from '@/utils/url'
import {createStoreValue} from '@/hooks/useStore'

import * as historyAction from './useHistoryAction'

const getKw=_=>parseUrl().query?.s || ''

export const text=createStoreValue(getKw)

const input=createStoreValue(getKw)

export function useInput() {
  const [inp, set_inp]=input.use()
  const [currText, set_currText]=text.use()
  const locKw=getKw()
  historyAction.useVal()
  React.useEffect(_=>{
    const t=setTimeout(_=>text.set(inp), 200)
    return _=>clearTimeout(t)
  }, [inp])
  React.useEffect(_=>{
    if(currText!==inp) set_inp(currText)
  }, [currText])
  React.useEffect(_=>{
    if(locKw!==currText) set_currText(locKw)
  }, [locKw])
  return [inp, set_inp]
}
