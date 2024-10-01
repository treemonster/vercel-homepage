import React from 'react'
import './index.scss'

import Toast from '@/components/Toast'
import {time2str} from '@/utils/format'
import {str2color} from '@/utils/color'
import {fetch} from '@/utils/fetch'
import {pushUrl, replaceUrl, goBack} from '@/utils/router'
import {useContentStateById} from '@/hooks/useContent'
import {useSearchState} from '@/hooks/useSearch'
import {useEditor} from '@/hooks/useEditor'

export default function(props) {
  const {
    id=0,
    title: _title='',
    tags: _tags='',
    content: _content='',
    create_at: _create_at=0,

    type,
  }=props

  const [enableEditor]=useEditor()

  const [
    {title, tags, content, create_at, editable},
    {set_title, set_tags, set_content, set_create_at, set_editable},
    {createContent, updateContent, deleteContentById},
  ]=useContentStateById(id, {
    title: _title,
    tags: _tags,
    content: _content,
    create_at: _create_at,
    editable: type==='new',
  })

  const {set_searchText}=useSearchState()

  const _fetchWithToast=async ([begin, done], task, cb)=>{
    Toast.show(begin)
    try{
      await task
      Toast.show(done)
      cb?.()
    }catch(e) {
      Toast.show(e.message)
    }
  }

  return <div className={'__view_scope '+type}>
    <div className={'title-line '+(editable? 'editing': '')}>

      <div className='left'>
        <div className='item'>
          <&=@/components/Text readOnly={!editable} value={title} onChange={value=>{
            set_title(value)
          }} />
          {!editable && create_at? <span className='date'>{time2str(create_at)}</span>: null}
        </div>
        <div className='item'>
          <&=@/components/Text readOnly={!editable} value={tags} className='tags' onChange={value=>{
            set_tags(value.split(',').map(x=>x.trim()).join(', '))
          }} render={x=>{
            return x.split(',').map(v=>{
              if(!v) return null
              v=v.trim()
              return <div className='tag' key={v} onClick={_=>{
                set_searchText(v)
                pushUrl(Router=>Router.Index)
              }} style={{backgroundColor: str2color(v)}}>{v}</div>
            })
          }} />
        </div>
      </div>

      {enableEditor && <&=@/components/EditBox
        className='btns'
        isEditing={editable}
        onEdit={_=>{
          if(type==='new') {
            _fetchWithToast(
              ['saving..', 'saved'],
              createContent({title, tags, content}),
              _=>{
                replaceUrl(Router=>Router.Index)
              }
            )
          }else{
            set_editable(!editable)
            if(editable) {
              _fetchWithToast(
                ['saving..', 'saved'],
                updateContent(id, {title, tags, content})
              )
            }
          }
        }}
        onDelete={_=>{
          if(type==='new') {
            goBack()
            return
          }
          if(editable) {
            set_editable(false)
          }else{
            if(confirm('delete it?')) {
              _fetchWithToast(
                ['deleting..', 'deleted'],
                deleteContentById(id),
              )
            }
          }
        }} />
      }

    </div>
    <div className={'markedpad '+(editable? '': 'readmode')}>
      <&=@/components/MarkedPad
        initialValue={content}
        onChange={newContent=>{
          set_content(newContent)
        }}
        enableInput={editable} />

      {!editable && type==='small' && <div className='detail' onClick={_=>{
        pushUrl(Router=>Router.Detail, {id})
      }}>
        <div className='tip'>
          view <&=@/components/Icon className='bi-arrow-right-circle-fill' size='small' />
        </div>
      </div>}

    </div>
  </div>
}
