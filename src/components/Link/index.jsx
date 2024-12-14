import React from 'react'
import * as historyAction from '@/hooks/useHistoryAction'
import {buildUrl, parseUrl} from '@/utils/url'
import './index.scss'

export default function(props) {
  const {
    url: _url,
    params: _params,
    href: _href,
    target='_self',
    children,
    className,
    onClick,
    ..._props
  }=props

  let url, params, href

  if(_href) {
    const {pathname, query}=parseUrl(_href)
    href=_href
    url=pathname
    params=query
  }else{
    params=typeof _params==='function'? _params(): _params
    url=_url
    href=buildUrl(url, params)
  }

  return <a
    href={href}
    target={target}
    className={[className, '__view_scope'].filter(Boolean).join(' ')}
    {..._props}
    onClick={e=>{
      e.preventDefault()
      e.stopPropagation()
      onClick?.(e)
      historyAction.pushUrl(url, params)
    }}
  >
    {children}
  </a>
}
