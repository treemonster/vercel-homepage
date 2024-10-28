<?js
  autoTouchByChanges(__dirname+'/index.jsx', [__dirname+'/play.s'])
  include(__dirname+'/play.s', {__USE_AS_TPL__: true})
  const playTpl=readEchoed()
?>

import React from 'react'
import './index.scss'

export default function(props) {
  const {sources, className=''}=props
  return <div className={'__view_scope '+className}>
    <&=@/components/Icon
      isSimpleBtn
      isDisabled={!sources}
      className='bi-play-fill'
      size='small'
      onClick={_=>{
        if(!window.__SUPPORT_ESMODULE__) {
          alert('Emm.. your browser is too old to support this feature.. :(')
          return
        }
        const url=URL.createObjectURL(new Blob([toHTML(sources)], {type: 'text/html'}))
        window.open(url)
      }}
      text={'Run'}
    />
  </div>
}

function toHTML(sources) {
  const tpl=<?js echo(JSON.stringify(playTpl)) ?>
  return tpl.replace(/##SOURCE##/, JSON.stringify(sources))
}
