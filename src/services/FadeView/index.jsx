import React from 'react'
import './index.scss'
import * as historyAction from '@/hooks/useHistoryAction'
import * as appInfo from '@/hooks/useAppInfo'
import {sleep} from '@/utils/base'
import {autoCleanList} from '@/utils/cache'

export default function(props) {
  const {
    render,
    classNames={
      base: 'fade',
      hide: 'hide',
      finish: 'fade-center',
      newIn: 'fade-right-hide',
      newOut: 'fade-right-hide',
      oldIn: 'fade-left-hide',
      oldOut: 'fade-left-hide',
    },
    duration=160,
  }=props
  const actionType=historyAction.useVal()
  const pages=React.useRef({arr: [], cur: 0}).current
  if(!pages.arr.length) pages.arr.push(render())
  const [pageInfo, set_pageInfo]=React.useState(_=>{
    const [page, zIndex]=pages.arr[pages.cur]
    return {
      page,
      isForward: false,
      isInit: true,
      zIndex,
    }
  })

  React.useEffect(_=>{
    const {isInit, isIn, isOut, isInReplace}=actionType
    if(isIn) {
      if(!isInReplace) ++pages.cur
      pages.arr[pages.cur]=render()
    }else if(isOut) {
      --pages.cur
    }
    let _isOut=isOut
    const [page, zIndex]=pages.arr[pages.cur]
    if(zIndex!==pageInfo.zIndex) {
      _isOut=zIndex<pageInfo.zIndex
    }
    set_pageInfo({
      page,
      isForward: !_isOut,
      isInit: false,
      zIndex,
    })
  }, [actionType])

  return <FadeView
    {...pageInfo}
    classNames={classNames}
    duration={duration}
  />
}

function getAppScrollTop() {
  if(document.querySelector) return document.querySelector('.app').scrollTop || 0
  return 0
}
function setAppScrollTop(x) {
  if(document.querySelector) document.querySelector('.app').scrollTop=x
}

function FadeView(props) {
  const {page, isForward, isInit, classNames, duration}=props
  const [pages, set_pages]=React.useState([{
    page,
    create: Date.now(),
    className: classNames.finish,
    scrollTop: getAppScrollTop(),
  }])
  const lock=React.useRef({
    locked: false,
    nextPage: null,
  }).current
  React.useEffect(_=>{
    if(isInit) return;
    if(lock.locked) {
      lock.nextPage=page
      return
    }
    const play=async page=>{
      appInfo.IsChangingPage.set(true)
      lock.locked=true
      const _curr=pages.find(x=>x.className===classNames.finish)
      const _next=autoCleanList(
        pages,
        x=>x.page===page,
        _=>({page, create: Date.now()}),
      )
      _next.className=isForward? classNames.newIn: classNames.oldIn
      _curr.className=isForward? classNames.oldOut: classNames.newOut
      _curr.scrollTop=getAppScrollTop()
      set_pages([...pages])
      await sleep(duration)
      _next.className=classNames.finish
      _curr.className=classNames.hide
      set_pages([...pages])
      lock.locked=false
      if(lock.nextPage===page) lock.nextPage=null
      if(lock.nextPage) {
        play(lock.nextPage)
        lock.nextPage=null
      }else{
        setAppScrollTop(_next.scrollTop)
      }
      appInfo.IsChangingPage.set(false)
    }
    play(page)
  }, [page])
  return <div className='__view_scope'>
    {
      pages.map(({page, className, create})=><div key={create} className={
        classNames.base+' '+className
      }>
        <div className='container'>{page}</div>
      </div>)
    }
  </div>
}
