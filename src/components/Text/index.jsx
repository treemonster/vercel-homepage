import React from 'react'

import './index.scss'

export default function(props) {
  const {value='', readOnly, className='', onChange, onConfirm, render}=props
  const [text, set_text]=React.useState(value)
  React.useEffect(_=>{
    if(text!==value) set_text(value)
  }, [value])
  return readOnly?
    <div className={'__view_scope text '+className}>{render? render(text): text}</div>:
    <input className={'__view_scope inputbox '+className} onChange={e=>{
      const v=e.target.value
      set_text(v)
      onChange?.(v)
    }} onKeyPress={e=>{
      if(e.keyCode===13) {
        onConfirm?.(e.target.value)
      }
    }} value={text} />
}
