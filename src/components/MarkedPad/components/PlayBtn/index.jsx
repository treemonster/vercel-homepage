import React from 'react'
import ReactDOM from 'react-dom'
import parseScss from '@/utils/css'
import './index.scss'
import Model from '@/components/Model'
import Toast from '@/components/Toast'
import {loadScript, createLock} from '@/utils/base'
import {createStoreValue} from '@/hooks/useStore'
import {waitGoBack} from '@/utils/ui'

const T_NORMAL=0
const T_HIDE=1

const playModelState=createStoreValue(T_NORMAL)

export default function(props) {
  const {sources, className=''}=props
  const stat=playModelState.useVal()

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
      onClick={_=>openPlayModel(
        <div className='__view_scope-toast'>
          <&=@/components/Loading isLoading />
          Downloading babel sdk..
        </div>,
        sources2ModelContent(sources),
      )}
      text={'Run'}
    />
  </div>
}

const lock=createLock('PLAYBTN')
async function openPlayModel(dlTip, mod) {
  if(lock.locked()) return;
  lock.lock()
  setTimeout(_=>{
    lock.unlock()
  }, 1e3)
  playModelState.set(T_HIDE)
  const [cancelWait, onGoBacked, hasGoBackPromise]=waitGoBack()

  let cancelled=false
  const closeToast=Toast.show(dlTip, 99999999)
  onGoBacked(_=>{
    cancelled=true
  })
  try{
    const [Comps, {onDestory, onOpen, isAlert}]=await mod

    if(cancelled) {
      throw new Error('cancelled')
    }

    if(isAlert) {
      closeToast()
      cancelWait()
      onOpen()
      setTimeout(_=>onDestory(), 1e3)
      throw null
    }

    Model.open(Comps, {
      onOpen: ModelApp=>{
        closeToast()
        onOpen(ModelApp)
      },
      onDestory: _=>{
        cancelWait()
        onDestory()
      },
    })
    onGoBacked(_=>{
      Model.close()
    })

  }catch(e) {
    if(e!==null) Toast.show(e.message)
  }

  playModelState.set(T_NORMAL)
}

async function sources2ModelContent(sources) {
  if(!window.__SUPPORT_ESMODULE__) {
    throw new Error('Emm.. your browser is too old to support this feature.. :(')
    return
  }
  try{
    await loadScript(window.__CDN_FILE_MAP__['babel.js'])
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
