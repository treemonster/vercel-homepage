import React from 'react'
import {Router, CustomRouter, getPageRef, getZIndex, getIsUnique} from '@/AppRouter'
import useHistoryAction from '@/hooks/useHistoryAction'
import {useVar} from '@/utils/base'
import {setRouter} from '@/utils/router'
import {autoCleanList} from '@/utils/cache'
import {useShareState} from '@/hooks/useShareState'

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
  const [status, set_status]=React.useState(_=>{
    return _payload===null && typeof fetchPayload==='function'?
      S_FETCHING:
      S_DONE
  })

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

  const p={
    status: e,
    data: e.isDone? payload: null,
    refetch: _=>set_status(S_FETCHING),
  }

  return p.data? children({payload: p}): <LoadingPayload payload={p} />
}

function useUnique(callback) {
  const KEY='useUnique'
  const unique=useVar(KEY+'/var', {val: []})
  const [n, set_n]=useShareState(KEY+'/state', unique.val)
  const key=React.useRef(Math.random()).current

  React.useEffect(_=>{
    unique.val.push([key, callback])
    set_n(...unique.val)
    return _=>{
      unique.val=unique.val.filter(x=>x[0]!==key)
      set_n(...unique.val)
    }
  }, [])

  return [
    unique.val?.[0]?.[0]===key,
    _=>{
      for(let [, fn] of unique.val) fn()
    },
  ]
}

function LoadingPayload(props) {
  const {height=200, payload}=props
  const {data, status, refetch}=payload
  const {isError, isFetching}=status
  const [isFirst, emitAll]=useUnique(refetch)
  return isFirst && <div className='payload-pending' style={{height}}>
    {isFetching && <&=@/components/Loading />}
    {isError && <div className='error'>
      <h3 className='title'>
        <&=@/components/Icon
          className='bi-emoji-surprise'
        /> Network error.
      </h3>
      <&=@/components/Icon
        className='bi-arrow-counterclockwise'
        onClick={emitAll}
        isBtn
        text={'reload'}
        size='normal'
      />
    </div>}
  </div>
}
