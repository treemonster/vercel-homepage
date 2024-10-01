import React from 'react'
import './index.scss'
import {useSearchState, getSearchTextFromURL} from '@/hooks/useSearch'
import {useEditor} from '@/hooks/useEditor'
import {pushUrl} from '@/utils/router'
import ContentList, {getFirstPageData} from '@/services/ContentList'

export async function fetchPayload() {
  return getFirstPageData(getSearchTextFromURL(), true)
}

export default function({payload}) {
  if(!payload.data) return null
  return <div className='__view_scope'>
    <CreateBtn />
    <ContentList firstPageData={payload.data} />
  </div>
}

function CreateBtn(props) {
  const [enable]=useEditor()
  return enable? <div className='create-btn'>
    <&=@/components/EditBox
      noMask
      createText='create'
      className='btn1'
      onCreate={_=>{
        pushUrl(Router=>Router.Create)
      }}
    />
  </div>: null
}
