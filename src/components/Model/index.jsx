// @csrWidget
import React from 'react'
import './index.scss'
import {mount} from '@/utils/widget'
import {createStoreValue} from '@/hooks/useStore'

const S_BEFORE_SHOW=1
const S_BEFORE_HIDE=2
const S_SHOWN=3
const S_HIDE=4

const ShowState=createStoreValue(S_HIDE)
const Content=createStoreValue(null)
const AppearClass=createStoreValue(null)

export default mount((props)=>{

  const divRef=React.useRef(null)
  const appRef=React.useRef(null)
  const ss=ShowState.useVal()
  const ac=AppearClass.useVal()
  const content=Content.useVal()
  const onDestroyRef=React.useRef(null)
  const onOpenRef=React.useRef(null)

  const {handler}=props
  handler.open=(content, option)=>{
    if(ShowState.val()!==S_HIDE) return;
    AppearClass.set(option?.appear || 'right')
    onDestroyRef.current=option?.onDestory || null
    onOpenRef.current=option?.onOpen || null
    ShowState.set(S_BEFORE_SHOW)
    Content.set(content)
  }
  handler.close=_=>{
    if(ShowState.val()!==S_SHOWN) return;
    ShowState.set(S_BEFORE_HIDE)
  }
  handler.MODEL_CLASSNAME=`__view_scope`
  React.useEffect(_=>{
    setTimeout(_=>{
      if(ss===S_BEFORE_SHOW) {
        ShowState.set(S_SHOWN)
      }else if(ss===S_BEFORE_HIDE) {
        ShowState.set(S_HIDE)
      }
    }, 300)
    if(ss===S_HIDE) {
      onDestroyRef.current?.()
      Content.set(null)
      ReactDOM.render(<div />, appRef.current)
    }else if(ss===S_SHOWN) {
      onOpenRef.current?.(appRef)
    }
  }, [ss])

  return <div ref={divRef} className={[
    '__view_scope',
    ss===S_SHOWN && 'appear',
    ss===S_HIDE && 'hide',
    (ss===S_BEFORE_SHOW || ss===S_BEFORE_HIDE) && 'show-before',
    ac && ss!==S_SHOWN && `appear-${ac}-before`,
  ].filter(Boolean).join(' ')}>
    <&=@/components/Icon className='bi-x-lg close-__view_scope' size={'large'} onClick={_=>{
      handler.close()
    }} />
    <div className='content-__view_scope'>
      {content}
      <div ref={appRef}></div>
    </div>
  </div>
})
