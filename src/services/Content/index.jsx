import React from 'react'
import './index.scss'
import {assert} from '@/utils/base'

import {time2str} from '@/utils/format'
import {str2color} from '@/utils/color'

import * as historyAction from '@/hooks/useHistoryAction'
import * as content from '@/hooks/useContent'
import * as appInfo from '@/hooks/useAppInfo'
import {text as searchText} from '@/hooks/useSearchText'
import {CustomRouter} from '@/AppRouter'
import Link from '@/components/Link'
import {asyncTaskWithToast} from '@/utils/ui'

export default function(props) {
  const {isSmallView, isDetailView, isCreateView}=props
  const {displayLoading, displayRetry, retryFunc}=props
  const id=isCreateView? content.CREATE_ID: props.id
  assert(typeof id==='number')
  const isEditing=appInfo.Editing.useVal()
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

  const detailCard=<div className={[
    '__view_scope',
    isCreateView && 'new',
    isDetailView && 'detail',
    isSmallView && 'small',
  ].filter(Boolean).join(' ')}>
    <div className={'title-line '+(editing? 'editing': 'readonly')}>

      <div className='left'>
        <div className='meta'>
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

      {isEditing && <&=@/components/EditBox
        className='btns'
        isEditing={editing}
        onEdit={isSmallView? null: _=>{
          const texts={
            beginText: 'saving..',
            doneText: 'saved',
          }
          if(isCreateView) {
            asyncTaskWithToast(texts, content.doCreate(), _=>{
              historyAction.replaceUrl(CustomRouter.Index.href)
            })
          }else{
            set_editing(!editing)
            if(editing) {
              asyncTaskWithToast(texts, content.doSaveById(id))
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
            asyncTaskWithToast(['deleting..', 'deleted'], content.doDeleteId(id), _=>{
              if(isDetailView) {
                historyAction.pushUrl('/')
              }
            })
          }
        }} />
      }

    </div>
    <div className={'markedpad '+(editing? '': 'readmode')}>
      {(_=>{
        if(displayLoading) return <&=@/components/Loading isLoading />
        if(displayRetry) return <&=@/components/Loading isBlock isRetry retryFunc={retryFunc} />
      })() || <&=@/components/MarkedPad
        initialValue={isSmallView? detail.summary: detail.content}
        onChange={nextContent=>edit({content: nextContent})}
        enableInput={editing}
      />}
      {isSmallView && <div className='mask' />}
    </div>

  </div>

  if(isSmallView && !editing) {
    return <Link
      url={CustomRouter.Detail.href}
      params={_=>({id, s: searchText.val()})}
    >
      {detailCard}
    </Link>
  }
  return detailCard
}
