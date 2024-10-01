import React from 'react'
import './index.scss'
import {fetch} from '@/utils/fetch'
import {useCreateList, useDeleteContent} from '@/hooks/useModifyList'
import {usePagedList} from '@/hooks/usePagedList'
import {useSearchState} from '@/hooks/useSearch'
import {useEditor} from '@/hooks/useEditor'
import {pushUrl} from '@/utils/router'

export async function fetchPayload() {
  return getFirstPageData()
}

async function getFirstPageData(searchText='') {
  const [
    {id: lastValidId},
    {list: payloadList, isEnd},
  ]=await Promise.all([
    fetch('/content/getLastId', {searchText}),
    fetch('/content/list', {id: -1, searchText}),
  ])

  const lastPayloadId=payloadList[payloadList.length-1]?.id

  return {
    bySearchText: searchText,
    lastValidId,
    payloadList,
    isEnd: isEnd || lastPayloadId===lastValidId,
    lastPayloadId,
  }
}

export default function(props) {
  const {
    searchText,
    set_searchText,
    confirmSearchText,
  }=useSearchState()

  const {payload}=props

  const setHead=(data, _heads=null)=>{
    if(!data) return;
    const {bySearchText: k}=data
    const e=_heads || heads
    if(!e._[k]) {
      e._[k]=data
      if(_heads===null) {
        set_heads({_: e._})
      }
    }
  }
  const [heads, set_heads]=React.useState(_=>{
    const e={_: {}}
    setHead(payload.data, e)
    return e
  })
  React.useEffect(_=>{
    setHead(payload.data)
  }, [payload.data])

  const fetches=React.useRef({'': true}).current
  React.useEffect(_=>{
    const k=confirmSearchText
    if(fetches[k] || heads._[k]) return;
    fetches[k]=true
    getFirstPageData(confirmSearchText).then(data=>{
      setHead(data)
    }, _=>{
      delete fetches[confirmSearchText]
    })
  }, [confirmSearchText])

  const data=heads._[searchText]
  return <div className='__view_scope'>
    <CreateBtn />
    <RenderList firstPageData={data} />
  </div>
}

function RenderList(props) {
  const {firstPageData}=props

  if(!firstPageData) return <ContentList payloadList={[]} />

  const {
    lastValidId,
    payloadList,
    isEnd,
    lastPayloadId,
  }=props.firstPageData

  return <>
    <ContentList payloadList={payloadList} />
    {!isEnd && <LoadMore
      lastValidId={lastValidId}
      lastPayloadId={lastPayloadId}
    />}
  </>
}

function ContentList(props) {
  const {payloadList}=props

  const {
    filterBySearchText,
    searchText,
  }=useSearchState()

  const {
    createList,
    watches: createListWatches,
  }=useCreateList()

  const {
    watches: deletedListWatches,
    filterDeleted,
  }=useDeleteContent()

  const {
    pagedList,
    watches: pagedListWatches,
  }=usePagedList(searchText)

  const list=React.useMemo(_=>{
    const _all=[...createList, ...payloadList, ...pagedList]
    const _list2=[filterDeleted, filterBySearchText].reduce((x, f)=>f(x), _all)
    const ls=[], _map={}
    for(let k of _list2) {
      if(_map[k.id]) continue
      _map[k.id]=1
      ls.push(k)
    }
    return ls
  }, [
    deletedListWatches,
    searchText,
    createListWatches,
    pagedListWatches,
  ])

  return React.useMemo(_=>list.map(v=><&=@/services/Content key={v.id} type='small' {...v} />), [list])

}

function LoadMore(props) {

  const {
    lastValidId,
    lastPayloadId,
  }=props

  const {
    searchText,
  }=useSearchState()

  const {
    isLoading,
    isEnd,
    loadNextPage,
  }=usePagedList(searchText)

  if(isEnd) return null
  return <div className='load-more'>
    {isLoading?
      <&=@/components/Icon
        className='bi-sun'
        isRotating
        size='large'
      />:
      <&=@/components/Icon
        onClick={_=>{
          loadNextPage({lastValidId, lastPayloadId})
        }}
        isSimpleBtn
        size='large'
        className='bi-chevron-double-down'
      />
    }
  </div>
}

function CreateBtn(props) {
  const [enable]=useEditor()
  return enable? <div className='create-btn'>
    <&=@/components/EditBox
      noMask
      createText='create'
      className='btn1'
      onCreate={_=>{
        pushUrl(Router=>Router.Create)
      }}
    />
  </div>: null
}
