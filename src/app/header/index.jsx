import React from 'react'
import './index.scss'
import {fetch} from '@/utils/fetch'
import {pushUrl, getPageRef, isCurrent} from '@/utils/router'
import {useSearchState} from '@/hooks/useSearch'
import {useEditor} from '@/hooks/useEditor'

export async function fetchPayload() {
  const [{readOnly}, {md: text}, {md: leftText}]=await Promise.all([
    fetch('/app/isReadOnly'),
    fetch('/app/header'),
    fetch('/app/headerLeftText'),
  ])
  return {readOnly, text, leftText}
}

export default function({payload}) {
  if(!payload.data) return <&=@/services/LoadingPayload payload={payload} />
  const {data}=payload
  const {readOnly, ...o}=data || {}
  return <div className='__view_scope'>
    <AppHeader isPlaceholder={true} {...o} />
    <AppHeader isPlaceholder={false} {...o} />
    {!readOnly && <SupportEditor />}
  </div>
}

function AppHeader(props) {
  const {isPlaceholder, text, leftText}=props
  const {page}=getPageRef()
  const leftRef=React.useRef(null)
  const {set_confirmSearchText}=useSearchState()

  React.useEffect(_=>{
    const c=leftRef.current
    if(!c) return;
    c.addEventListener('click',e=>{
      e.preventDefault()
      const p=e.target.getAttribute('href')
      if(!p) return;
      pushUrl(_=>p)
    })
  }, [])
  return <div className={(isPlaceholder? 'placeholder': 'fixed')}>
    <&=@/services/Container children={<>

    <div className='with-back'>
      <&=@/services/AppInfo
        text={text}
        action='/app/saveHeader'
        isPlaceholder={isPlaceholder}
      />
    </div>

    <div className='tabs'>
      {
        isPlaceholder?
          null:
          <>
            <div className='left' ref={leftRef}>
              <&=@/services/AppInfo
                key={page}
                className='left-info'
                text={leftText}
                action='/app/saveHeaderLeftText'
                isPlaceholder={isPlaceholder}
                parser={x=>{
                  const e=[]
                  x.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, (_, text, link)=>{
                    e.push(<a key={text} href={link} className={isCurrent(link)? 'active': ''}>{text}</a>)
                  })
                  return e
                }}
              />
            </div>
            <div className='right'>
              <SearchBtn />
            </div>
          </>
      }
    </div>

    </>} />

  </div>
}

function SearchBtn(props) {

  const {
    searchText,
    set_searchText,
    set_confirmSearchText,
  }=useSearchState()

  return <div className='searchbox' onClick={_=>{
    pushUrl(Router=>Router.Index)
  }}>
    <&=@/components/Text
      className='search'
      value={searchText}
      onChange={x=>set_searchText(x)}
      onConfirm={x=>set_confirmSearchText(x)}
      readOnly={false}
    />
    {
      searchText?
        <&=@/components/Icon className="bi-x-lg" onClick={_=>set_searchText('')} />:
        <&=@/components/Icon className='bi-search' />
    }
  </div>
}

function SupportEditor(props) {
  const [enable, set_enable]=useEditor()
  return <div className='editor-switch' onClick={_=>{
    set_enable(!enable)
  }}>
    <&=@/components/Icon
      className={enable? 'bi-unlock-fill': 'bi-lock-fill'}
      isActive={enable? true: false}
    />
  </div>
}
