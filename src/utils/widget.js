import React from 'react'
import ReactDOM from 'react-dom'

// @csrOnlyFunction
export function mount(V) {
  const wrapper=document.createElement('div')
  document.body.appendChild(wrapper)
  const handler={}
  ReactDOM.render(<V handler={handler} />, wrapper)
  return handler
}
