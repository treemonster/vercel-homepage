import 'intersection-observer'
import React from 'react'

export default function(props) {
  const {
    onVisible,
    onInVisible,
    exposeOnce,
    className,
    children,
    option,
  }=props

  const wrapperRef=React.useRef(null)
  React.useEffect(_=>{
    const observer=new IntersectionObserver((entries, observer)=>{
      if(!entries[0].isIntersecting) {
        onInVisible?.()
      }else{
        onVisible?.()
        if(exposeOnce) {
          observer.disconnect()
        }
      }
    }, option)
    observer.observe(wrapperRef.current)
    return _=>observer.disconnect()
  }, [onVisible, exposeOnce, onInVisible, option])

  return <div className={className} ref={wrapperRef}>{children}</div>
}
