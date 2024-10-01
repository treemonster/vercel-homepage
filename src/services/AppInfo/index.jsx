import React from 'react'
import './index.scss'

import Toast from '@/components/Toast'
import {fetch} from '@/utils/fetch'
import {useShareState} from '@/hooks/useShareState'
import {useEditor} from '@/hooks/useEditor'

export default function(props) {
  const [enable]=useEditor()
  const {
    text: _text='',
    action,
    forPlaceholder=false,
    className='',
    parser=null,
  }=props

  const [text, set_text]=useShareState('AppInfo#'+action, _text)
  const [editable, set_editable]=React.useState(false)

  React.useEffect(_=>{
    if(_text!==text) set_text(_text)
  }, [_text])

  const _fetchWithToast=async _=>{
    Toast.show('saving..')
    try{
      await fetch(action, {text})
      Toast.show('saved')
    }catch(e) {
      Toast.show(e.message)
    }
  }

  return <div className={[
    '__view_scope',
    className,
    forPlaceholder && 'placeholder',
  ].filter(Boolean).join(' ')}>
    <div className={'markedpad '+(editable? 'editable': '')}>
      <&=@/components/MarkedPad
        initialValue={text}
        onChange={set_text}
        enableInput={editable}
        parser={parser}
      />
    </div>
    {enable && <&=@/components/EditBox
      className='btnbox'
      isEditing={editable}
      onEdit={_=>{
        set_editable(!editable)
        if(editable) {
          _fetchWithToast()
        }
      }} />
    }
  </div>
}
