import React from 'react'
import './index.scss'

import Toast from '@/components/Toast'
import {time2str} from '@/utils/format'
import {str2color} from '@/utils/color'

import {pushUrl, replaceUrl, goBack} from '@/utils/router'
import {useContentStateById, useSearchText} from '@/hooks/useContent'
import {useEditor} from '@/hooks/useEditor'

async function fetchWithToast([begin, done], task, cb) {
  Toast.show(begin)
  try{
    await task
    Toast.show(done)
    cb?.()
  }catch(e) {
    Toast.show(e.message)
  }
}

export default function(props) {
  const {type, detail=null}=props
  const [enableEditor]=useEditor()
  const {
    title, set_title,
    tags, set_tags,
    summary, set_summary,
    content, set_content,
    create_at, set_create_at,

    doCreate,
    doUpdate,
    doDelete,
  }=useContentStateById(detail?.id || 0, detail)
  const [, set_searchText]=useSearchText()
  const [editing, set_editing]=React.useState(false)
  React.useEffect(_=>{
    if(!content && detail?.content) {
      set_content(detail.content)
    }
    if(type==='new') set_editing(true)
  }, [])

  return <div className={'__view_scope '+type}>
    <div className={'title-line '+(editing? 'editing': '')}>

      <div className='left'>
        <div className='item'>
          <&=@/components/Text readOnly={!editing} value={title} onChange={value=>{
            set_title(value)
          }} className='title' />
          {!editing && create_at? <span className='date'>{time2str(create_at)}</span>: null}
        </div>
        <div className='item right'>
          <&=@/components/Text readOnly={!editing} value={tags} className='tags' onChange={value=>{
            set_tags(value.split(',').map(x=>x.trim()).join(', '))
          }} render={x=>{
            return x.split(',').map(v=>{
              if(!v) return null
              v=v.trim()
              return <div className='tag' key={v} onClick={_=>{
                set_searchText('tag: '+v)
                pushUrl(Router=>Router.Index)
              }} style={{backgroundColor: str2color(v)}}>{v}</div>
            })
          }} />
        </div>
      </div>

      {enableEditor && <&=@/components/EditBox
        className='btns'
        isEditing={editing}
        onEdit={type==='small'? null: _=>{
          if(type==='new') {
            fetchWithToast(['saving..', 'saved'], doCreate(), _=>{
              replaceUrl(Router=>Router.Index)
            })
          }else{
            set_editing(!editing)
            if(editing) {
              fetchWithToast(['saving..', 'saved'], doUpdate())
            }
          }
        }}
        onDelete={_=>{
          if(type==='new') {
            goBack()
            return
          }
          if(editing) {
            set_editing(false)
          }else{
            if(!confirm('delete it?')) return;
            fetchWithToast(['deleting..', 'deleted'], doDelete())
          }
        }} />
      }

    </div>
    <div className={'markedpad '+(editing? '': 'readmode')}>
      <&=@/components/MarkedPad
        initialValue={type==='small'? summary: content}
        onChange={newContent=>{
          set_content(newContent)
        }}
        enableInput={editing}
      />

      {!editing && type==='small' && <div className='detail' onClick={_=>{
        pushUrl(Router=>Router.Detail, {id: detail.id})
      }}>
        <div className='tip'>
          view <&=@/components/Icon className='bi-arrow-right-circle-fill' size='small' />
        </div>
      </div>}

    </div>
  </div>

}
