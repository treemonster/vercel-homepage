import React from 'react'
import './index.scss'
import {fetch} from '@/utils/fetch'
import {useSearchState} from '@/hooks/useSearch'
import {createUseShareStateGroup} from '@/hooks/useShareState'
import {useCreateList, useDeleteContent} from '@/hooks/useModifyList'

const HOOK_PREFIX='services/ContentList'

export default function(props) {
  const {confirmSearchText}=useSearchState()
  return <ContentList
    key={confirmSearchText}
    searchText={confirmSearchText}
    firstPageData={props.firstPageData}
  />
}
function ContentList(props) {
  const {searchText, firstPageData}=props
  const {
    contentList,
    isFetching, isEnd, isError,
    loadNextPage,
  }=usePageDataList(
    searchText,
    firstPageData.bySearchText===searchText? firstPageData: null,
  )

  return <div className='__view_scope'>
    {contentList.map(c=><FadeIn showImmediate={c._isSsr} key={c.id}>
      <&=@/services/Content type='small' {...c} />
    </FadeIn>)}
    <LoadMore isEnd={isEnd} isLoading={isFetching} onLoadBtnClick={loadNextPage} />
  </div>
}

function FadeIn(props) {
  const {showImmediate, children}=props
  const [show, set_show]=React.useState(showImmediate)
  return <&=@/components/Expose
    onVisible={_=>set_show(true)}
    children={<div className={'v-fade '+(show? '': 'v-fade-hide')}>{show? children: null}</div>}
  />
}
function LoadMore(props) {
  const {isEnd, isLoading, onLoadBtnClick}=props
  if(isEnd) return null
  return <div className='load-more'>
    {isLoading?
      <&=@/components/Loading />:
      <&=@/components/Expose onVisible={_=>{
        onLoadBtnClick()
      }} children={<&=@/components/Icon
        isSimpleBtn
        size='large'
        className='bi-chevron-double-down'
      />} />
    }
  </div>
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
function usePageDataList(searchText, _firstPageData=null) {
  const useShareState=createUseShareStateGroup(HOOK_PREFIX+'/usePageDataList/'+searchText, true)
  const [firstPageData, set_firstPageData]=useShareState(_firstPageData)
  const [isFetching, set_isFetching]=useShareState(false)
  const [list, set_list]=useShareState(_firstPageData?.payloadList || [])
  const [isEnd, set_isEnd]=useShareState(_firstPageData?.isEnd || false)
  const [isError, set_isError]=useShareState(false)
  const [lastListId, set_lastListId]=useShareState(_firstPageData?.lastPayloadId || null)
  const {list: createList}=useCreateList()
  const {deletes: deleteIds, filterDeleted}=useDeleteContent()
  const _buildContentList=_=>{
    const contentList=[], _f={}
    for(let item of [...createList, ...filterDeleted(list)]) {
      if(_f[item.id]) continue
      _f[item.id]=true
      contentList.push(item)
    }
    return contentList
  }
  const [contentList, set_contentList]=useShareState(_buildContentList)

  const _fetchFirstPage=async _=>{
    set_isFetching(true)
    try{
      const firstPageData=await getFirstPageData(searchText)
      set_firstPageData(firstPageData)
      set_list(firstPageData.payloadList)
      set_lastListId(firstPageData.lastPayloadId)
      set_isEnd(firstPageData.isEnd)
    }catch(e) {}
    set_isFetching(false)
  }
  const _fetchNextPage=async _=>{
    set_isFetching(true)
    try{
      const {nextList, isEnd}=await getPageList(searchText, {
        lastValidId: firstPageData.lastValidId,
        lastListId,
      })
      if(nextList.length) {
        set_list(list.concat(nextList))
        set_lastListId(nextList[nextList.length-1]?.id)
      }
      set_isEnd(isEnd)
    }catch(e) {}
    set_isFetching(false)
  }
  const loadNextPage=async _=>{
    const fn=contentList.length? _fetchNextPage: _fetchFirstPage
    set_isError(false)
    try{
      await fn()
    }catch(e) {
      set_isError(true)
    }
  }

  React.useEffect(_=>{
    set_contentList(_buildContentList())
  }, [searchText, list, createList, deleteIds])

  React.useEffect(_=>{
    if(contentList.length || isFetching || isError) return;
    loadNextPage()
  }, [])

  return {
    contentList,
    isFetching, isEnd, isError,
    loadNextPage,
  }
}
