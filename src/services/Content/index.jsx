import React from 'react'
import './index.scss'

import Toast from '@/components/Toast'
import {time2str} from '@/utils/format'
import {str2color} from '@/utils/color'

import * as historyAction from '@/hooks/useHistoryAction'
import * as content from '@/hooks/useContent'
import {Editing} from '@/hooks/useAppInfo'
import {text as searchText} from '@/hooks/useSearchText'
import {CustomRouter} from '@/AppRouter'
import Link from '@/components/Link'

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
  const {isSmallView, isDetailView, isCreateView}=props
  const id=isCreateView? content.CREATE_ID: props.id
  const isEditing=Editing.useVal()
  const [editing, set_editing]=React.useState(false)
  React.useEffect(_=>{
    if(isCreateView) set_editing(true)
  }, [])
  React.useEffect(_=>{
    if(!editing) return;
    content.initEditContentById(id)
  }, [editing])
  const detail=content.useContentById(id, editing)

  function edit(kv) {
    content.editContentValue(id, kv)
  }

  return <div className={[
    '__view_scope',
    isCreateView && 'new',
    isDetailView && 'detail',
    isSmallView && 'small',
  ].filter(Boolean).join(' ')}>
    <div className={'title-line '+(editing? 'editing': '')}>

      <div className='left'>
        <div className='item'>
          <&=@/components/Text
            readOnly={!editing}
            value={detail.title}
            onChange={title=>edit({title})}
            className='title'
          />
          {!editing && detail.create_at?
            <span className='date'>{time2str(detail.create_at)}</span>:
            null
          }
        </div>
        <div className='item right'>
          <&=@/components/Text
            readOnly={!editing}
            value={detail.tags}
            className='tags'
            onChange={value=>{
              edit({tags: value.split(',').map(x=>x.trim()).join(', ')})
            }}
            render={x=>{
              return x.split(',').map(v=>{
                if(!v) return null
                v=v.trim()
                const s='tag: '+v
                return <Link
                  className='tag'
                  key={v}
                  onClick={_=>searchText.set(s)}
                  url={CustomRouter.Index.href}
                  params={{s}}
                  style={{backgroundColor: str2color(v)}}
                >{v}</Link>
              })
            }}
          />
        </div>
      </div>

      {isEditing && <&=@/components/EditBox
        className='btns'
        isEditing={editing}
        onEdit={isSmallView? null: _=>{
          if(isCreateView) {
            fetchWithToast(['saving..', 'saved'], content.doCreate(), _=>{
              historyAction.replaceUrl(CustomRouter.Index.href)
            })
          }else{
            set_editing(!editing)
            if(editing) {
              fetchWithToast(['saving..', 'saved'], content.doSaveById(id))
            }
          }
        }}
        onDelete={_=>{
          if(isCreateView) {
            historyAction.goBack()
            return
          }
          if(editing) {
            set_editing(false)
          }else{
            if(!confirm('delete it?')) return;
            fetchWithToast(['deleting..', 'deleted'], content.doDeleteId(id))
          }
        }} />
      }

    </div>
    <div className={'markedpad '+(editing? '': 'readmode')}>
      <&=@/components/MarkedPad
        initialValue={isSmallView? detail.summary: detail.content}
        onChange={nextContent=>edit({content: nextContent})}
        enableInput={editing}
      />

      {!editing && isSmallView && <Link className='detail' url={CustomRouter.Detail.href} params={{id}}>
        <div className='tip'>
          full view <&=@/components/Icon className='bi-arrow-right-circle-fill' size='small' />
        </div>
      </Link>}

    </div>
  </div>
}
