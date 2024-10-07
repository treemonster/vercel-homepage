import React from 'react'
import {fetch} from '@/utils/fetch'
import {useVar} from '@/utils/base'
import {createUseShareStateGroup} from '@/hooks/useShareState'
import {useCreateList, useDeleteContent} from '@/hooks/useModifyList'

function getContentStore() {
  return useVar('CONTENT_DATA_STORE', {})
}

export function useContentStateById(id, e) {
  const useShareState=createUseShareStateGroup('useContentStateByIdStore#'+id)
  const [title, set_title]=useShareState(e?.title || '')
  const [tags, set_tags]=useShareState(e?.tags || '')
  const [content, set_content]=useShareState(e?.content || '')
  const [create_at, set_create_at]=useShareState(e?.create_at || 0)
  const [editable, set_editable]=useShareState(e?.editable || false)

  React.useEffect(_=>{
    getContentStore()[id]=getContentStore()[id] || {}
    const e=getContentStore()[id]
    Object.assign(e, {title, tags, content, create_at, editable})
    if(undefined===e._title) Object.assign(e, {_title: title, _tags: tags, _content: content})
  }, [title, tags, content, create_at, editable])

  React.useEffect(_=>{
    if(e.content.length>content.length) set_content(e.content)
  }, [e.content])

  const {addNew}=useCreateList()
  const createContent=async ({title, tags, content})=>{
    const {id, create_at}=await fetch('/content/create', {title, tags, content})
    addNew({id, title, tags, content, create_at})
    set_title('')
    set_tags('')
    set_content('')
  }

  const updateContent=async (id, {title, tags, content})=>{
    const e=getContentById(id)
    if(e._title===title && e._tags===tags && e._content===content) return;
    e._title=title
    e._tags=tags
    e._content=content
    const {create_at}=await fetch('/content/update', {id, title, tags, content})
    set_create_at(create_at)
  }

  const {deleteById}=useDeleteContent()
  const deleteContentById=async id=>{
    await fetch('/content/delete', {id})
    deleteById(id)
  }

  return [
    {title, tags, content, create_at, editable},
    {set_title, set_tags, set_content, set_create_at, set_editable},
    {createContent, updateContent, deleteContentById},
  ]
}

export function getContentById(id) {
  return getContentStore()[id] || {}
}
