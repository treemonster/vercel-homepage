import React from 'react'
import './index.scss'
import {fetch} from '@/utils/fetch'
import * as appInfo from '@/hooks/useAppInfo'
import * as search from '@/hooks/useSearchText'
import * as historyAction from '@/hooks/useHistoryAction'
import {CustomRouter, isCurrent} from '@/AppRouter'

export async function init(payload) {
  if(!payload) {
    const [{readOnly}, {md: headerText}, {md: leftText}]=await Promise.all([
      fetch('/app/isReadOnly'),
      fetch('/app/header'),
      fetch('/app/headerLeftText'),
    ])
    payload={readOnly, headerText, leftText}
  }
  const {readOnly, headerText, leftText}=payload
  appInfo.ReadOnly.set(readOnly)
  appInfo.HeaderText.set(headerText)
  appInfo.HeaderLeftText.set(leftText)
  return payload
}

export default function() {
  const readOnly=appInfo.ReadOnly.useVal()
  return <div className='__view_scope'>
    <AppHeader />
    {!readOnly && <SupportEditor />}
  </div>
}

function AppHeader(props) {
  const [headerText, set_headerText]=appInfo.HeaderText.use()
  const [height, set_height]=React.useState(0)
  const headerRef=React.useRef(null)
  React.useEffect(_=>{
    set_height(headerRef.current.offsetHeight)
  }, [headerText])

  return <div className='header' style={height? {height}: {}}>
    <div className={(height? 'fixed': 'normal')} ref={headerRef}>
      <&=@/services/Container
        children={<>
          <&=@/services/AppInfo
            textStore={appInfo.HeaderText}
            action='/app/saveHeader'
          />
          <div className='tabs'>
            <div className='left'>
              <LeftMenu />
            </div>
            <div className='right'>
              <SearchBtn />
            </div>
          </div>
        </>}
      />
    </div>
  </div>
}

function LeftMenu(props) {
  const menuRef=React.useRef(null)
  React.useEffect(_=>{
    const c=menuRef.current
    if(!c) return;
    c.addEventListener('click',e=>{
      e.preventDefault()
      const p=e.target.getAttribute('href')
      if(!p) return;
      historyAction.pushUrl(p)
      search.text.set('')
    })
  }, [])
  historyAction.useVal()
  return <div ref={menuRef}>
    <&=@/services/AppInfo
      className='left-info'
      textStore={appInfo.HeaderLeftText}
      action='/app/saveHeaderLeftText'
      parser={x=>{
        const e=[]
        x.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, (_, text, link)=>{
          e.push(<a key={text} href={link} className={isCurrent(link)? 'active': ''}>{text}</a>)
        })
        return e
      }}
    />
  </div>
}

function SearchBtn(props) {

  const [inp, set_inp]=search.useInput()

  const jsReady=appInfo.JavascriptReady.useVal()

  return <div className={[
    'searchbox',
    !jsReady && 'disable-search',
  ].filter(Boolean).join(' ')} onClick={_=>{
    historyAction.pushUrl(CustomRouter.Index.href)
  }}>
    <&=@/components/Text
      className='search'
      value={inp}
      onChange={x=>set_inp(x)}
      onConfirm={x=>search.text.set(x)}
      readOnly={false}
    />
    {
      inp?
        <&=@/components/Icon className="bi-x-lg" onClick={_=>set_inp('')} />:
        <&=@/components/Icon className='bi-search' />
    }
  </div>
}

function SupportEditor(props) {
  const [isEditing, set_isEditing]=appInfo.Editing.use()
  return <div className='editor-switch' onClick={_=>set_isEditing(!isEditing)}>
    <&=@/components/Icon
      className={isEditing? 'bi-unlock-fill': 'bi-lock-fill'}
      isActive={isEditing? true: false}
    />
  </div>
}
