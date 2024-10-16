import React from 'react'
import './index.scss'
import {fetch} from '@/utils/fetch'
import {useSearchText, useContentList} from '@/hooks/useContent'

export default function(props) {
  const {firstPageData}=props
  const [searchText]=useSearchText()
  const {createList, appendToList, getList, buildFullList, watches}=useContentList(firstPageData)
  const {arr, isEnd, lastValidId}=getList(searchText)

  return <&=@/components/ExposeList
    key={searchText}
    watches={watches}
    className='__view_scope'
    isEnd={isEnd}
    prevState={{arr, lastValidId}}
    render={({arr, lastValidId}, {isEnd})=>{
      const _arr=buildFullList(arr)
      return <>
        {_arr.map(c=><FadeIn showImmediate={c._isSsr} key={c.id}>
          <&=@/services/Content type='small' detail={c} />
        </FadeIn>)}
        {(_=>{
          if(!isEnd) return null
          if(!_arr.length) return <div className='empty'>
            <&=@/components/Icon className='bi-emoji-surprise' />
            Found 0 matches.
          </div>
          return <div className='bottom'>-- All results have been shown. --</div>
        })()}
      </>
    }}
    loadNextPage={async ({arr, lastValidId})=>{
      if(!arr.length) {
        const {isEnd, payloadList, lastValidId}=await getFirstPageData(searchText)
        const nextState={arr: payloadList, lastValidId}
        createList(searchText, {...nextState, isEnd})
        return {isEnd, nextState}
      }else{
        const {isEnd, nextList}=await getPageList(searchText, {
          lastValidId,
          lastListId: arr[arr.length-1].id,
        })
        const nextState={arr: [...arr, ...nextList], lastValidId}
        appendToList(searchText, {nextList, isEnd})
        return {isEnd, nextState}
      }
    }}
  />
}

function FadeIn(props) {
  const {showImmediate, children}=props
  const [show, set_show]=React.useState(showImmediate)
  return <&=@/components/Expose
    onVisible={_=>set_show(true)}
    children={<div className={'v-fade '+(show? '': 'v-fade-hide')}>{show? children: null}</div>}
  />
}

export async function getFirstPageData(searchText='', isSsr=false) {
  const [
    {id: lastValidId},
    {list: payloadList, isEnd},
  ]=await Promise.all([
    fetch('/content/getLastId', {searchText}, 'firstpage-lastid'),
    fetch('/content/list', {id: -1, searchText}, 'firstpage-list'),
  ])

  const lastPayloadId=payloadList[payloadList.length-1]?.id

  return {
    bySearchText: searchText,
    lastValidId,
    payloadList: payloadList.map(x=>{
      x._isSsr=isSsr
      return x
    }),
    isEnd: isEnd || lastPayloadId===lastValidId,
    lastPayloadId,
  }
}

async function getPageList(searchText, {lastValidId, lastListId}) {
  const {list: nextList, isEnd}=await fetch('/content/list', {
    id: lastListId,
    lastValidId,
    searchText,
  })
  return {nextList, isEnd}
}
