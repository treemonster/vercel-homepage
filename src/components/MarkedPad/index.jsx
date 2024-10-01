import React from 'react'
import './index.scss'
import { marked } from 'marked/marked.min'

function parse(x) {
  return marked.parse(x || '').trim().replace(/\n+/g, '\n')
}

export default function(props) {
  const {enableInput=true, onChange, initialValue, replacer}=props
  const [inpVal, set_inpVal]=React.useState(initialValue)
  const [markedVal, set_markedVal]=React.useState(_=>parse(initialValue))
  const txtRef=React.useRef(null)
  const markedRef=React.useRef(null)
  const top=React.useRef(0)

  React.useEffect(_=>{
    const v=initialValue
    if(v===inpVal) return;
    set_inpVal(v)
    set_markedVal(parse(v))
  }, [initialValue])

  React.useEffect(_=>{
    window.hljs?.highlightAll?.()
  }, [markedVal, enableInput])

  const output=replacer? replacer(markedVal): markedVal

  return React.useMemo(_=><div className={'__view_scope'+(enableInput? '': ' readonly')}>
    {enableInput?
      <textarea ref={txtRef} className='box inp' value={inpVal} onChange={e=>{
        const v=e.target.value
        set_inpVal(v)
        set_markedVal(marked.parse(v))
        onChange && onChange(v)
      }} onScroll={e=>{
        const nt=e.target.scrollTop
        const v=top.current
        top.current=nt
        markedRef.current.scrollTop+=nt-v
      }} />:
      null
    }
    <div onClick={_=>{
      txtRef.current && txtRef.current.focus()
    }} className='box marked' ref={markedRef} key={enableInput? 'write': 'read'}>
      {
        typeof output==='string'?
          <div dangerouslySetInnerHTML={{__html: output}} />:
          output
      }
    </div>
  </div>, [inpVal, enableInput])
}
