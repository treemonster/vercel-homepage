import React from 'react'
import './index.scss'
import {fetch} from '@/utils/fetch'
import {pushUrl, getPageRef, isCurrent} from '@/utils/router'
import {useSearchText} from '@/hooks/useContent'
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
  const {readOnly, ...o}=payload.data || {}
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
  const [, set_searchText]=useSearchText()

  React.useEffect(_=>{
    const c=leftRef.current
    if(!c) return;
    c.addEventListener('click',e=>{
      e.preventDefault()
      const p=e.target.getAttribute('href')
      if(!p) return;
      pushUrl(_=>p)
      set_searchText('')
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
  const [searchText, set_searchText]=useSearchText()
  const [inp, set_inp]=React.useState(searchText)

  React.useEffect(_=>{
    const t=setTimeout(_=>{
      set_searchText(inp)
    }, 200)
    return _=>clearTimeout(t)
  }, [inp])
  React.useEffect(_=>{
    if(inp!==searchText) set_inp(searchText)
  }, [searchText])

  return <div className='searchbox' onClick={_=>{
    pushUrl(Router=>Router.Index)
  }}>
    <&=@/components/Text
      className='search'
      value={inp}
      onChange={x=>set_inp(x)}
      onConfirm={x=>set_searchText(x)}
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
