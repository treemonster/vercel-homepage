import React from 'react'
import './index.scss'

export default function(props) {
  const {

    noMask=false,

    onDelete=null,
    onCreate=null,
    onEdit=null, isEditing=false,

    style=null,

    className='',

    createText='',

  }=props

  return <div className={[
    '__view_scope',
    className,
    noMask || 'mask',
    onDelete && 'deleteable',
    onCreate && 'createable',
    onEdit && 'editable',
  ].filter(Boolean).join(' ')} style={style}>

    {onCreate && <&=@/components/Icon
      className='bi-plus-square-fill'
      isBtn
      size={'small'}
      text={createText}
      onClick={onCreate}
    />}

    {onEdit && <&=@/components/Icon
      className={isEditing? 'bi-unlock-fill': 'bi-lock-fill'}
      isBtn
      isActive={isEditing? true: false}
      size={'small'}
      onClick={onEdit}
    />}

    {onDelete && <&=@/components/Icon
      className='bi-x-lg'
      isBtn
      size={'small'}
      onClick={onDelete}
    />}
  </div>
}
