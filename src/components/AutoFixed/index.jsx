import React from 'react'
import './index.scss'

export default function(props) {
  const {
    children,
    className,
    marginTop=0,
    scroller=document.scrollingElement,
    watchChildrenChange=[],
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
