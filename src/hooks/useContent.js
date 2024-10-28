
import React from 'react'
import {createStoreValue} from '@/hooks/useStore'
import {fetch} from '@/utils/fetch'
import {text as searchText} from './useSearchText'

/**
 Contents={
   [contentId]: StoreValue({title,. tags, ...}),
   ...
 }
 */
export const Contents={}

/**
 Edits={
   [contentId]: StoreValue({title,. tags, ...}),
   ...
 }
 */
export const Edits={}

/**
 ContentKwList={
   [keyword]: StoreValue({
     arr: [...contentIds],
     isEnd: false,
     nextParam: null,
     isFetching: false,
     isError: false,
   }),
   ...
 }
 */
export const ContentKwList={}

/**
 CreateList=[...contentIds]
 */
export const CreateList=createStoreValue([])

/**
 DeleteList=[...contentIds]
 */
export const DeleteList=createStoreValue([])

/**
 SsrList=[...contentIds]
 */
export const SsrList=createStoreValue([])

export async function fetchList(searchText, param=null) {
  if(!param) {
    const [{id: lastValidId}, {list: nextList, isEnd}]=await Promise.all([
      fetch('/content/getLastId', {searchText}, 'firstpage-lastid'),
      fetch('/content/list', {id: -1, searchText}, 'firstpage-list'),
    ])
    return {
      isEnd,
      nextList,
      nextParam: {
        lastValidId,
        id: nextList[nextList.length-1]?.id,
      },
    }
  }else{
    const {list: nextList, isEnd}=await fetch('/content/list', {searchText, ...param})
    return {
      isEnd,
      nextList,
      nextParam: {
        lastValidId: param.lastValidId,
        id: nextList[nextList.length-1]?.id || param.id,
      },
    }
  }
}
export async function fetchDetail(id) {
  return await fetch('/content/detail', {id})
}
export const CREATE_ID=0
const bak=(_=>{
  const key='contentBackup'
  const _read=_=>{
    try{
      return JSON.parse(localStorage.getItem(key)) || {}
    }catch(e) {}
    return {}
  }
  const _save=fn=>{
    const s=_read()
    fn(s)
    try{
      localStorage.setItem(key, JSON.stringify(s))
    }catch(e) {}
  }
  const save=(id, o)=>{
    _save(s=>{
      s[id]=o
    })
  }
  const remove=id=>{
    _save(s=>{
      delete s[id]
    })
  }
  const read=id=>_read()[id]
  return {read, save, remove}
})()
export function useContentById(id, editing=false) {
  const read=getContentById(id, false).useVal()
  const write=getContentById(id, true).useVal()
  return editing? write: read
}
export async function doCreate() {
  const e=getContentById(CREATE_ID, true).val()
  if(!e) return;
  const {title, tags, content}=e
  const {id, summary, create_at}=await fetch('/content/create', {title, tags, content})
  updateContent({id, title, tags, content, summary, create_at})
  Edits[CREATE_ID].set(formatContent())
  CreateList.set([id, ...CreateList.val()])
  bak.remove(CREATE_ID)
}
export async function doDeleteId(id) {
  await fetch('/content/delete', {id})
  delete Contents[id]
  delete Edits[id]
  DeleteList.set([...store.DeleteList, id])
  bak.remove(id)
}
export async function doSaveById(id) {
  const e=getContentById(id, true).val()
  if(!e) return;
  const {title, tags, content}=e
  const {summary}=await fetch('/content/update', {id, title, tags, content})
  updateContent({id, title, tags, content, summary})
  bak.remove(id)
}
export function initEditContentById(id) {
  Edits[id].set(formatContent(Object.assign(
    {},
    getContentById(id, false).val(),
    bak.read(id),
  )))
}
export function editContentValue(id, kvs) {
  const e=Edits[id]
  const v={...e.val(), ...kvs}
  e.set(v)
  bak.save(id, v)
}
export function appendToKwList(kw, {nextList=[], ...param}) {
  const curr=getContentKwListByKw(kw)
  const v=curr.val()
  curr.set(Object.assign({}, v, {
    ids: v.ids.concat(nextList.map(x=>x.id)),
    ...param,
  }))
  updateContents(nextList)
}
export function useKwList(kw) {
  const createIds=CreateList.useVal()
  const deleteIds=DeleteList.useVal()
  const ssrIds=SsrList.useVal()
  const curr=getContentKwListByKw(kw).useVal()
  return React.useMemo(_=>{
    const ret={
      ids: [],
      isEnd: curr.isEnd,
      isError: curr.isError,
      isFetching: curr.isFetching,
    }
    for(let id of [...createIds, ...curr.ids]) {
      if(deleteIds.includes(id)) continue
      ret.ids.push({id, isFromSsr: ssrIds.includes(id)})
    }
    return ret
  }, [kw, createIds, deleteIds, ssrIds, curr])
}
export async function loadNextPage(kw) {
  const curr=getContentKwListByKw(kw)
  const v=curr.val()
  if(v.isFetching) return;
  v.isError=false
  v.isFetching=true
  curr.set({...v})

  const update={
    isFetching: false,
  }
  try{
    Object.assign(update, await fetchList(kw, v.nextParam), {
      isError: false,
    })
  }catch(e) {
    update.isError=true
  }
  appendToKwList(kw, update)
}
export function updateContent(a) {
  updateContents([a])
}

function formatContent(c=null) {
  return {
    id: c?.id || CREATE_ID,
    title: c?.title || '',
    tags: c?.tags || '',
    content: c?.content || '',
    summary: c?.summary || '',
    create_at: c?.create_at || 0,
  }
}
function updateContents(arr) {
  for(const {id, ...kvs} of arr) {
    if(!Contents[id]) {
      Contents[id]=createStoreValue({})
    }
    const v=Contents[id]
    v.set(formatContent({id, ...v.val(), ...kvs}))
  }
}
function getContentKwListByKw(kw) {
  if(!ContentKwList[kw]) {
    ContentKwList[kw]=createStoreValue({
      ids: [],
      nextParam: null,
      isEnd: false,
      isFetching: false,
      isError: false,
    })
  }
  return ContentKwList[kw]
}
function getContentById(id, fromEdit=false) {
  const stor=fromEdit? Edits: Contents
  if(!stor[id]) stor[id]=createStoreValue(formatContent({id}))
  return stor[id]
}
