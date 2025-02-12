import React from 'react'
import App, * as app from './App'

export async function init(payload) {
  const r='init'
  return app?.[r]?.(payload) || null
}

#ifndef IS_NODE_TARGET

import ReactDOM from 'react-dom'
import './scss/app.scss'
const appRoot=document.querySelector('.app')
const payload=window.__ssr_payload__

if(!window.React) {
  window.ReactDOM=ReactDOM
  window.React=React
}
window.KAZE2024_JS_READY=window.ReactDOM &&
  window.IntersectionObserver &&
  window.React &&
  window.marked &&
  window.hljs &&
  true
window.APP_ROOT=appRoot

;(async _=>{
  if(payload) await init(payload)
  ReactDOM.hydrate(<App />, appRoot)
})()

#else

// server
import Server from 'react-dom/server'

export function renderToString() {
  return Server.renderToString(<App />)
}

#endif
