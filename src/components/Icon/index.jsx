import React from 'react'
import './index.scss'
import 'bootstrap-icons/font/bootstrap-icons.min.css'

export default function(props) {
  const {
    className='',
    onClick=null,
    isBtn=false,
    isSimpleBtn=false,
    isActive=false,
    isDisabled=false,
    isRotating=false,
    text='',
    size='normal',
  }=props

  return <div onClick={e=>{
    if(isDisabled) return;
    onClick?.(e)
  }} className={[
    '__view_scope',
    isBtn && 'btn',
    isSimpleBtn && 'simple-btn',
    isActive && 'active',
    isDisabled && 'disabled',
    isRotating && 'rotating',
    size==='normal' && 'normal-size',
    size==='small' && 'small-size',
    size==='large' && 'large-size',
  ].filter(Boolean).join(' ')}>
    {text && <span className='text'>{text}</span>}
    <i className={'bi '+className} />
  </div>
}
