import React from 'react'
import {fetch} from '@/utils/fetch'
import {useVar} from '@/utils/base'
import {parseUrl} from '@/utils/url'
import {createUseShareStateGroup, useShareState} from '@/hooks/useShareState'

const STORE_PREFIX='USE_CONTENT'

function getContentStore() {
  return useVar(STORE_PREFIX+'/CONTENT_DATA_STORE', {})
}

export function getContentById(id) {
  return getContentStore()[id] || null
}

export function useContentStateById(id, _detail=null) {
  const useShareState=createUseShareStateGroup(STORE_PREFIX+'/detail#'+id)
  const [title, set_title]=useShareState(_detail?.title || '')
  const [tags, set_tags]=useShareState(_detail?.tags || '')
  const [summary, set_summary]=useShareState(_detail?.summary || '')
  const [content, set_content]=useShareState(_detail?.content || '')
  const [create_at, set_create_at]=useShareState(_detail?.create_at || 0)
  const {addNew}=useCreateList()
  const {deleteById}=useDeleteList()

  function updateContentById(id, x) {
    Object.assign(getContentStore()[id]=getContentStore()[id] || {}, x, {id})
  }

  React.useEffect(_=>{
    updateContentById(id, {title, tags, content, summary, create_at})
  }, [title, tags, summary, content, create_at])

  const doCreate=async _=>{

    const {id: _id, summary, create_at}=await fetch('/content/create', {title, tags, content})
    updateContentById(_id, {title, tags, content, summary, create_at})
    addNew(getContentById(_id))
    set_title('')
    set_tags('')
    set_summary('')
    set_content('')

  }

  const doUpdate=async _=>{

    const {summary}=await fetch('/content/update', {id, title, tags, content})
    set_summary(summary)

  }

  const doDelete=async _=>{
    await fetch('/content/delete', {id})
    deleteById(id)
  }

  return {
    title, set_title,
    tags, set_tags,
    summary, set_summary,
    content, set_content,
    create_at, set_create_at,

    doCreate,
    doUpdate,
    doDelete,
  }

}

function useCreateList() {
  const [list, set_list]=useShareState(STORE_PREFIX+'/newlist', [])
  const addNew=li=>{
    list.unshift(li)
    set_list([...list])
  }
  return {list, addNew}
}

function useDeleteList() {
  const [deletes, set_deletes]=useShareState(STORE_PREFIX+'/deletes', [])
  const filterDeleted=arr=>arr.map(x=>deletes.includes(x.id)? null: x).filter(Boolean)
  const deleteById=id=>{
    if(deletes.includes(id)) return;
    deletes.push(id)
    set_deletes([...deletes])
  }
  return {deletes, deleteById, filterDeleted}
}

export function getSearchTextFromURL() {
  return parseUrl().query?.s || ''
}

export function useSearchText() {
  return useShareState(STORE_PREFIX+'/searchtext', _=>getSearchTextFromURL())
}

export function useContentList(initState) {
  const [o, set_o]=useShareState(STORE_PREFIX+'/listbyst', _=>{
    if(!initState) return {}
    const {
      bySearchText,
      payloadList,
      lastValidId,
      isEnd,
    }=initState
    return {
      [bySearchText]: {
        arr: payloadList,
        isEnd,
        lastValidId,
      }
    }
  })
  const {list}=useCreateList()
  const {deletes, filterDeleted}=useDeleteList()
  const createList=(searchText, {arr, lastValidId, isEnd})=>{
    o[searchText]={arr, isEnd, lastValidId}
    set_o({...o})
  }
  const appendToList=(searchText, {nextList, isEnd})=>{
    const e=o[searchText]
    e.arr=e.arr.concat(nextList)
    e.isEnd=isEnd || false
    set_o({...o})
  }
  const getList=(searchText)=>{
    const e=o[searchText]
    return {
      arr: e?.arr || [],
      isEnd: e?.isEnd || false,
      lastValidId: e?.lastValidId || null,
    }
  }
  const buildFullList=arr=>{
    let ids=new Set
    return filterDeleted([...list, ...(arr || [])]).map(x=>{
      if(ids.has(x.id)) return;
      ids.add(x.id)
      return x
    }).filter(Boolean).map(x=>getContentById(x.id) || x)
  }
  return {
    createList,
    appendToList,
    getList,
    buildFullList,
    watches: [list, deletes],
  }
}
