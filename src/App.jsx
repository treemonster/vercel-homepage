import React from 'react'
import {Router, CustomRouter, getPageRef, getZIndex, getIsUnique} from '@/AppRouter'
import useHistoryAction from '@/hooks/useHistoryAction'
import {useVar} from '@/utils/base'
import {setRouter} from '@/utils/router'
import {autoCleanList} from '@/utils/cache'

export async function fetchPayload() {
  return Promise.all([
    Router.module.header?.fetchPayload?.(),
    getPageRef().ref?.fetchPayload?.(),
    Router.module.footer?.fetchPayload?.(),
  ])
}

export default function({payload}) {
  const [, router]=useHistoryAction()
  setRouter(CustomRouter, router)

  const getPageKey=e=>getIsUnique(e)? e.path: location.href
  const _afp=(ref, key)=><AutofillPayload
    payload={payloads[key] || null}
    updatePayload={payload=>{
      payloads[key]=payload
    }}
    fetchPayload={ref.fetchPayload}
    children={props=>ref.default({...props})}
  />

  const HeaderKey='_Header', FooterKey='_Footer'

  const e=getPageRef()
  const payloads=useVar('payloadStore', _=>({
    [HeaderKey]: payload?.[0],
    [getPageKey(e)]: payload?.[1],
    [FooterKey]: payload?.[2],
  }))
  const pageStoreArr=useVar('pageStoreArr', [])

	return <>
    {_afp(Router.module.header, HeaderKey)}
    <&=@/services/Container children={
      <&=@/components/FadeView render={_=>{
        const e=getPageRef()
        const pageKey=getPageKey(e)
        return autoCleanList(
          pageStoreArr,
          x=>x.pageKey===pageKey,
          _=>({pageKey, page: [_afp(e.ref, pageKey), getZIndex(e)]}),
        ).page
      }} />
    } />
    {_afp(Router.module.footer, FooterKey)}
  </>
}

function AutofillPayload(props) {
  const {
    payload: _payload=null,
    fetchPayload,
    updatePayload,
    children,
  }=props

  const S_FETCHING=1, S_DONE=2, S_ERROR=3
  const [payload, set_payload]=React.useState(_payload)
  const [status, set_status]=React.useState(
    _payload===null && typeof fetchPayload==='function'? S_FETCHING: S_DONE)

  const e={
    isFetching: status===S_FETCHING,
    isError: status===S_ERROR,
    isDone: status===S_DONE,
  }

  React.useEffect(_=>{
    if(!e.isFetching) return;
    let r=true
    ; (async _=>{
      try{
        const t=await fetchPayload()
        if(!r) return;
        updatePayload?.(t)
        set_payload(t)
        set_status(S_DONE)
      }catch(e) {
        set_status(S_ERROR)
      }
    })()
    return _=>{
      r=false
    }
  }, [status])

  return children({
    payload: {
      status: e,
      data: e.isDone? payload: null,
      refetch: _=>set_status(S_FETCHING),
    },
  })

}
