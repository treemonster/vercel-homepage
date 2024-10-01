import React from 'react'
import './index.scss'
import marked from 'marked/marked.min'

marked.use({
  headerIds: false,
  mangle: false,
  slient: true,
})

function parse(x) {
  x=x || ''
  const tokens=marked.lexer(x)
  let _tokens=[], _arr=[], _is_code=false
  for(let token of tokens) {
    const _code=token.type==='code'
    if(_code===_is_code) {
      _arr.push(token)
      continue
    }
    if(_arr.length) {
      _tokens.push([_is_code, _arr])
      _arr=[]
    }
    _is_code=_code
    _arr.push(token)
  }
  if(_arr.length) _tokens.push([_is_code, _arr])

  const codes={}
  const _is=x=>!['', '0', 'no', 'false', undefined].includes(x)
  return _tokens.map(([is_code, t], i)=>{
    t.links=tokens.links
    if(!is_code) {
      return <div key={i} dangerouslySetInnerHTML={{__html: marked.parser(t).trim()}} />
    }
    const sources=[]
    let toolbar=false, play=false
    for(let code of t) {
      const [lang, x]=code.lang.split(':')
      let attrs=x? x.split(';').reduce((a, b)=>{
        if(b=b.trim()) {
          const [k, v]=b.split('=')
          a[k]=v
        }
        return a
      }, {}): {}
      if(x) toolbar=true
      play=play || _is(attrs.main)
      attrs.language=lang
      attrs.index=_is(attrs.index)
      attrs.main=_is(attrs.main)
      attrs.code=code.text.trim()
      const _filename=attrs.filename
      if(!attrs.code && codes[_filename]) {
        Object.assign(attrs, codes[_filename])
      }
      sources.push(attrs)
      if(attrs.code) codes[_filename]=attrs
    }
    return <CodePanel key={`${i}-${sources.length}`}
      codes={sources}
      toolbar={toolbar}
      play={play}
    />
  })
}

function CodePanel(props) {
  const {codes, toolbar, play}=props
  const [index, set_index]=React.useState(_=>codes.reduce((a, b, i)=>a || (b.index? i: 0), 0))
  const code=codes[index]
  const codeRef=React.useRef(null)
  React.useEffect(_=>{
    if(!codeRef.current) return;
    codeRef.current.removeAttribute('data-highlighted')
    window.hljs?.highlightElement(codeRef.current)
  }, [index, codes])
  if(!code) return null
  return <div className='code-panel hljs'>
    {toolbar && <div className='toolbar'>
      <div className='filename-tabs'>
        {codes.map(({code, language, filename}, i)=><div
          onClick={_=>set_index(i)}
          key={filename}
          className={'tab'+(i===index? ' active': '')}
        >{filename}</div>)}
      </div>
      {play && <&=@/components/PlayBtn className='playbtn' sources={codes.map(x=>({
        type: x.type,
        value: x.code,
        filename: x.filename,
        main: x.main,
      }))} />}
    </div>}
    <div className='code-board' key={code.filename || 'unknown'}>
      <pre>
        <code className={"hljs language-"+code.language} ref={codeRef}>{code.code}</code>
      </pre>
    </div>
  </div>
}

export default function(props) {
  const {enableInput=true, onChange, initialValue, parser}=props
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

  const output=parser? parser(inpVal): markedVal

  return React.useMemo(_=><div className={'__view_scope'+(enableInput? '': ' readonly')}>
    {enableInput?
      <textarea ref={txtRef} className='box inp' value={inpVal} onChange={e=>{
        const v=e.target.value
        set_inpVal(v)
        set_markedVal(parse(v))
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
      {output}
    </div>
  </div>, [inpVal, enableInput])
}
