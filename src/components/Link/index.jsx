import React from 'react'
import * as historyAction from '@/hooks/useHistoryAction'
import {buildUrl} from '@/utils/url'
import './index.scss'

export default function(props) {
  const {
    url, params,
    target='_self',
    children,
    className,
    onClick,
    ..._props
  }=props

  return <a
    href={buildUrl(url, params)}
    target={target}
    className={[className, '__view_scope'].filter(Boolean).join(' ')}
    {..._props}
    onClick={e=>{
      e.preventDefault()
      onClick?.(e)
      historyAction.pushUrl(url, params)
    }}
  >
    {children}
  </a>
}
