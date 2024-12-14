import React from 'react'
import './index.scss'
import * as content from '@/hooks/useContent'
import * as appInfo from '@/hooks/useAppInfo'
import {text as searchText} from '@/hooks/useSearchText'
import * as historyAction from '@/hooks/useHistoryAction'
import Memo from '@/components/Memo'
import {CustomRouter} from '@/AppRouter'

export async function init(payload) {
  const kw=searchText.val()
  if(!payload) payload=await content.fetchList(kw)
  content.appendToKwList(kw, payload)
  content.SsrList.set(payload.nextList.map(x=>x.id))
  return payload
}

export default function() {
  const kw=searchText.useVal()
  const isEditing=appInfo.Editing.useVal()
  return <div className='__view_scope'>
    {
      isEditing && <div className='create-btn'>
        <&=@/components/EditBox
          noMask
          createText='create'
          className='btn1'
          onCreate={_=>{
            historyAction.pushUrl(CustomRouter.Create.href)
          }}
        />
      </div>
    }
    <ContentList key={kw} kw={kw} />
  </div>
}

function ContentList({kw}) {
  const {ids, isEnd, isError, isFetching}=content.useKwList(kw)
  const jsReady=appInfo.JavascriptReady.useVal()
  const isAnimating=appInfo.IsChangingPage.useVal()

  return <div className='content-list'>
    {ids.map(({id, isFromSsr})=><Memo key={id} watches={[id]}>
      <FadeIn showImmediate={isFromSsr}>
        <&=@/services/Content isSmallView id={id} />
      </FadeIn>
    </Memo>)}
    {
      jsReady && <div className='loading-place'>
        {(_=>{
          if(isEnd) {
            return ids.length?
              <div className='bottom'>-- All results have been shown. --</div>:
              <div className='empty'>
                <&=@/components/Icon className='bi-emoji-surprise' />
                Found 0 matches.
              </div>
          }
          if(isFetching) {
            return <&=@/components/Loading isLoading />
          }
          if(isError) {
            return <&=@/components/Icon
              isSimpleBtn
              size='large'
              className='bi-chevron-double-down'
              onClick={_=>content.loadNextPage(kw)}
            />
          }
          return isAnimating? null: <&=@/components/Expose
            option={{rootMargin: '1px'}}
            exposeOnce={false}
            onVisible={_=>content.loadNextPage(kw)}
            children={<&=@/components/Loading isLoading />}
          />
        })()}
      </div>
    }
  </div>
}

function FadeIn(props) {
  const {showImmediate, children}=props
  const [show, set_show]=React.useState(showImmediate)
  return <&=@/components/Expose
    onVisible={_=>set_show(true)}
    exposeOnce={true}
    children={<div className={'v-fade '+(show? '': 'v-fade-hide')}>{show? children: null}</div>}
  />
}
