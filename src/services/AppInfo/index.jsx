import React from 'react'
import './index.scss'

import Toast from '@/components/Toast'
import {fetch} from '@/utils/fetch'
import {Editing} from '@/hooks/useAppInfo'
import {asyncTaskWithToast} from '@/utils/ui'

export default function(props) {
  const isEditing=Editing.useVal()
  const {
    textStore,
    action,
    className='',
    parser=null,
  }=props

  const [text, set_text]=textStore.use()
  const [editing, set_editing]=React.useState(false)

  return <div className={['__view_scope', className].filter(Boolean).join(' ')}>
    <div className={'markedpad '+(editing? 'editable': '')}>
      <&=@/components/MarkedPad
        initialValue={text}
        onChange={set_text}
        enableInput={editing}
        parser={parser}
      />
    </div>
    {isEditing && <&=@/components/EditBox
      className='btnbox'
      isEditing={editing}
      onEdit={_=>{
        set_editing(!editing)
        if(editing) {
          asyncTaskWithToast({
            beginText: 'saving..',
            doneText: 'saved',
          }, fetch(action, {text}))
        }
      }} />
    }
  </div>
}
