import React from 'react'
import './index.scss'
import {isSupportSticky} from '@/utils/ui'

export default function(props) {
  const {
    className='',
    marginTop=0,
    children,
  }=props

  const [sup, set_sup]=React.useState(true)
  React.useEffect(_=>{
    isSupportSticky().then(set_sup)
  }, [])

  if(sup) {
    return <div className={className} style={{
      position: 'sticky',
      top: marginTop,
    }}>
      {children}
    </div>
  }

  return <FixedDowngrade {...props} />

}

function FixedDowngrade(props) {
  const {
    className='',
    marginTop=0,
    scroller=document.scrollingElement,
    children,
  }=props

  const wrapperRef=React.useRef(null)
  const contentRef=React.useRef(null)
  const [fixed, set_fixed]=React.useState(false)
  const [height, set_height]=React.useState(0)
  function getHeight() {
    return contentRef.current.offsetHeight
  }
  function getTop() {
    return wrapperRef.current.offsetTop
  }

  React.useEffect(_=>{
    set_height(getHeight())
  }, [children])

  React.useEffect(_=>{
    const fn=_=>{
      const t=scroller.scrollTop
      const isFixed=t>=getTop()-marginTop
      if(isFixed===fixed) return;
      set_fixed(isFixed)
    }
    scroller.addEventListener('scroll', fn)
    fn()
    return _=>scroller.removeEventListener('scroll', fn)
  }, [fixed])

  return <div style={height? {height}: {}} ref={wrapperRef}>
    <div ref={contentRef} className={[
      '__view_scope',
      className,
      fixed && 'fixed',
    ].filter(Boolean).join(' ')} style={{
      top: fixed? marginTop: 0,
    }}>
      {children}
    </div>
  </div>
}
