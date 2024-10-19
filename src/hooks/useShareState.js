import React from 'react'
import {useVar} from '@/utils/base'
function getStore() {
  return useVar('USE_SHARE_STATE_STORE', {})
}
export function defineShareState(k, v, durable=false) {
  const p=getStore()
  p[k]=p[k] || {
    val: typeof v==='function'? v(): v,
    durable,
    funcs: new Set,
  }
  return p[k]
}
export function getShareStateValue(k) {
  return defineShareState(k).val
}
export function useShareState(k, _v=undefined, durable=false) {
  const ref=defineShareState(k, _v, durable)
  const {val, funcs}=ref
  const [v, set_v]=React.useState(val)
  React.useEffect(_=>{
    funcs.add(set_v)
    return _=>{
      funcs.delete(set_v)
      if(!funcs.size && !ref.durable) {
        delete getStore()[k]
      }
    }
  }, [])
  const _set_v=nv=>{
    ref.val=nv
    for(const f of funcs) f(nv)
  }
  return [v, _set_v]
}
export function createUseShareStateGroup(k, durable=false) {
  let i=0
  return _v=>useShareState(k+'#'+(++i), _v, durable)
}
