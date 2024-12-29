import React from 'react'
import ReactDOM from 'react-dom'
import parseScss from '@/utils/css'
import './index.scss'
import Model from '@/components/Model'
import Toast from '@/components/Toast'
import {loadScript} from '@/utils/base'

const T_NORMAL=0
const T_HIDE=1

export default function(props) {
  const {sources, className=''}=props
  const [stat, set_stat]=React.useState(T_NORMAL)
  return <div className={[
    '__view_scope',
    className,
    stat===T_NORMAL? 'normal': 'hide',
  ].filter(Boolean).join(' ')}>
    <&=@/components/Icon
      isSimpleBtn
      isDisabled={!sources}
      className='bi-play-fill'
      size='small'
      onClick={async _=>{
        set_stat(T_HIDE)
        try{
          const cancel=Toast.show(<div className='__view_scope-toast'>
            <&=@/components/Loading isLoading />
            Downloading babel sdk..
          </div>, 99999999)
          const [Comps, option]=await sources2ModelContent(sources)
          Model.open(Comps, option)
          cancel()
          Toast.hide()
          set_stat(T_NORMAL)
        }catch(e) {
          Toast.show(e.message)
          set_stat(T_NORMAL)
        }
      }}
      text={'Run'}
    />
  </div>
}

async function sources2ModelContent(sources) {
  if(!window.__SUPPORT_ESMODULE__) {
    throw new Error('Emm.. your browser is too old to support this feature.. :(')
    return
  }
  try{
    await loadScript('https://unpkg.com/@babel/standalone@7.26.4/babel.min.js')
  }catch(e) {
    throw new Error('Emm.. some script files download failed.. :(')
    return
  }

  const es_imports={
    "react": URL.createObjectURL(new Blob(['export default window.React'], {type: 'text/javascript'})),
    "react-dom": URL.createObjectURL(new Blob(['export default window.ReactDOM'], {type: 'text/javascript'})),
    emptyImportLink: URL.createObjectURL(new Blob(['export default {}'], {type: 'text/javascript'})),
  }
  const Comps=[]
  let mainScript=null

  for(const s of sources) {
    if(['html'].includes(s.type)) {
      Comps.push(<div key={s.filename} dangerouslySetInnerHTML={{__html: s.value}} />)
    }else if(['scss', 'css'].includes(s.type)) {
      const css=parseScss(`.${Model.MODEL_CLASSNAME}{${s.value}}`)
      Comps.push(<div key={s.filename} dangerouslySetInnerHTML={{__html: `<style type='text/css'>${css}</style>`}} />)
    }else if(['js', 'react'].includes(s.type)) {
      const _trans=code=>Babel.transform(code, {
        presets: ['react'],
        plugins: [{
          visitor: {
            // https://babeljs.io/docs/babel-types#importdeclaration
            ImportDeclaration(specifiers, source) {
              const i=specifiers.node.source
              const k=i.value.replace(/^\.\//, '')
              i.value=es_imports[k] || es_imports.emptyImportLink
            },
          }
        }],
      }).code
      if(!s.main) {
        es_imports[s.filename]=URL.createObjectURL(new Blob([_trans(s.value)], {type: 'text/javascript'}))
        continue
      }
      mainScript=document.createElement('script')
      mainScript.type='module'
      mainScript.innerHTML=_trans(s.value.replace(/const\s+app\s*=/, x=>{
        return `${x}window.ModelApp.current //`
      }))
    }
  }

  return [Comps, {
    onDestory: _=>{
      if(mainScript) document.body.removeChild(mainScript)
      for(const k in es_imports) {
        URL.revokeObjectURL(es_imports[k])
      }
      delete window.ModelApp
    },
    onOpen: ModelApp=>{
      window.ModelApp=ModelApp
      if(mainScript) document.body.appendChild(mainScript)
    },
  }]
}
