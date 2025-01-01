import React from 'react'
import ReactDOM from 'react-dom'
import parseScss from '@/utils/css'
import './index.scss'
import Model from '@/components/Model'
import Toast from '@/components/Toast'
import {loadScript} from '@/utils/base'
import {createStoreValue} from '@/hooks/useStore'

const T_BTN_RUN=0
const T_BTN_PLAYING=1
const btnState=createStoreValue(T_BTN_RUN)

const T_SDK_SUCCESS=0
const T_SDK_DOWNLOADING=1
const T_SDK_SHOULD_DL=2
const sdkState=createStoreValue(T_SDK_SHOULD_DL)

export default function(props) {
  const {sources}=props
  const bs=btnState.useVal()
  const ss=sdkState.useVal()

  return <div className={[
    '__view_scope',
    bs===T_BTN_RUN && 'btn-pulse',
    bs===T_BTN_PLAYING && 'btn-disable',
  ].filter(Boolean).join(' ')}>
    {
      ss===T_SDK_DOWNLOADING?
        <&=@/components/Icon
          isSimpleBtn
          className='bi-sun'
          isRotating
          size='small'
          text={'downloading sdk..'}
        />:
        <&=@/components/Icon
          isSimpleBtn
          isDisabled={!sources}
          className='bi-play-fill'
          size='small'
          onClick={_=>openPlayModel(sources)}
          text={'Run'}
        />
    }
  </div>
}

async function openPlayModel(sources) {
  btnState.set(T_BTN_PLAYING)

  try{
    const url=location.href
    const [Comps, {onDestory, onOpen, isAlert}]=await sources2ModelContent(sources)
    if(url!==location.href) throw new Error('cancelled')
    if(isAlert) {
      onOpen()
      setTimeout(_=>onDestory(), 1e3)
    }else{
      Model.open(Comps, {onOpen, onDestory})
    }
  }catch(e) {
    Toast.show(e.message)
  }

  btnState.set(T_BTN_RUN)
}

async function sources2ModelContent(sources) {
  if(!window.__SUPPORT_ESMODULE__) {
    throw new Error('Emm.. your browser is too old to support this feature.. :(')
    return
  }

  if(sdkState.val()!==T_SDK_SUCCESS) {
    try{
      sdkState.set(T_SDK_DOWNLOADING)
      await loadScript(window.__CDN_FILE_MAP__['babel.js'])
      sdkState.set(T_SDK_SUCCESS)
    }catch(e) {
      sdkState.set(T_SDK_SHOULD_DL)
      throw new Error('Emm.. some script files download failed.. :(')
      return
    }
  }

  const es_imports={
    "react": URL.createObjectURL(new Blob(['export default window.React'], {type: 'text/javascript'})),
    "react-dom": URL.createObjectURL(new Blob(['export default window.ReactDOM'], {type: 'text/javascript'})),
    emptyImportLink: URL.createObjectURL(new Blob(['export default {}'], {type: 'text/javascript'})),
  }
  const Comps=[]
  let mainScript=null
  const option={
    onDestory: _=>{
      if(mainScript) document.body.removeChild(mainScript)
      for(const k in es_imports) {
        URL.revokeObjectURL(es_imports[k])
      }
      delete window.ModelApp
    },
    onOpen: ModelApp=>{
      if(ModelApp) window.ModelApp=ModelApp
      if(mainScript) document.body.appendChild(mainScript)
    },
    isAlert: false,
  }

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

      if(s.alert) option.isAlert=true
    }
  }

  return [Comps, option]
}
