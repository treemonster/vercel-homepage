import React from 'react'
import App, * as app from './App'

#ifndef IS_NODE_TARGET

import ReactDom from 'react-dom'
import './scss/app.scss'
const appRoot=document.querySelector('.app')
const payload=window.__ssr_payload__
if(!payload) {
  ReactDom.render(<App payload={null} />, appRoot)
}else{
  ReactDom.hydrate(<App payload={payload} />, appRoot)
}

#else

// server
import Server from 'react-dom/server'
export {initRequest as prepareCtx} from './nodeAdapter'

export function renderToString(payload) {
  return Server.renderToString(<App payload={payload} />)
}

export function fetchPayload() {
  const r='fetchPayload'
  return app?.[r]?.() || null
}

#endif
