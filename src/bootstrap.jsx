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

window.KAZE2024_JS_READY=true
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
