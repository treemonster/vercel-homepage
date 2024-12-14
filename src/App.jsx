import 'scrollingelement'

import React from 'react'

import {Router, CustomRouter, getPageRef, getZIndex, getIsUnique} from '@/AppRouter'
import {autoCleanList} from '@/utils/cache'
import {useMergeLoading, usePayload, JavascriptReady} from '@/hooks/useAppInfo'

function pageRef2pageKey(e) {
  if(e===Router.module.header) return '_Header'
  if(e===Router.module.footer) return '_Footer'
  return getIsUnique(e)? e.path: location.href
}

export async function init(payloads) {
  const modules=[
    Router.module.header,
    getPageRef().ref,
    Router.module.footer,
  ].filter(Boolean)
  if(!modules.length) return;

  return Promise.all(modules.map(async (m, i)=>{
    const t=await m?.init?.(payloads?.[i])
    usePayload(pageRef2pageKey(m)).set(t)
    return t
  }))
}

const pageArr=[]
export default function() {
  React.useEffect(_=>{
    JavascriptReady.set(true)
  }, [])
	return <>
    <AutoInit pageRef={Router.module.header} />
    <div className='app-container'>
      <&=@/services/FadeView render={_=>{
        const e=getPageRef()
        const pageKey=pageRef2pageKey(e)
        return autoCleanList(
          pageArr,
          x=>x.pageKey===pageKey,
          _=>({pageKey, page: [
            <AutoInit pageRef={e.ref} />,
            getZIndex(e),
          ]}),
        ).page
      }} />
    </div>
    <AutoInit pageRef={Router.module.footer} />
  </>
}

function AutoInit({pageRef}) {
  const pageKey=pageRef2pageKey(pageRef)
  const S_FETCHING=1, S_DONE=2, S_ERROR=3
  const [payload, set_payload]=usePayload(pageKey).use()
  const [status, set_status]=React.useState(_=>{
    return payload===null && typeof pageRef.init==='function'?
      S_FETCHING:
      S_DONE
  })

  const isFetching=status===S_FETCHING
  const isError=status===S_ERROR
  const isDone=status===S_DONE

  React.useEffect(_=>{
    if(!isFetching) return;
    ; (async _=>{
      try{
        set_payload(await pageRef.init())
        set_status(S_DONE)
      }catch(e) {
        set_status(S_ERROR)
      }
    })()
  }, [status])

  const retryFunc=useMergeLoading(pageKey, isDone, _=>set_status(S_FETCHING))
  const Page=pageRef.Page || pageRef.default
  const isCustomCatchError=Page===pageRef.Page

  const e={
    isDone,
    isError,
    isFetching,
    retryFunc,
  }
  if(isDone) return <Page {...e} />
  if(isError || isFetching) {
    return isCustomCatchError?
      <Page {...e} />:
      <&=@/components/Loading
        retryFunc={retryFunc}
        isRetry={isError}
        isLoading={isFetching}
        isBlock
      />
  }

}
