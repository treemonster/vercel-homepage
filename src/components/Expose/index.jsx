import 'intersection-observer'
import React from 'react'

export default function(props) {
  const {
    onVisible,
    className,
    children,
  }=props

  const wrapperRef=React.useRef(null)
  React.useEffect(_=>{
    const observer=new IntersectionObserver((entries, observer)=>{
      if(!entries[0].isIntersecting) return;
      onVisible?.()
      observer.disconnect()
    })
    observer.observe(wrapperRef.current)
    return _=>observer.disconnect()
  }, [])

  return <div className={className} ref={wrapperRef}>{children}</div>
}
