import React from 'react'
import './index.scss'

export default function(props) {
  const {height=200, payload}=props
  const {data, status, refetch}=payload
  const {isError, isFetching}=status
  return <div className='__view_scope' style={{height}}>
    {isFetching && <&=@/components/Loading />}
    {isError && <div className='error'>
      <h3 className='title'>
        <&=@/components/Icon
          className='bi-emoji-surprise'
        /> Network error.
      </h3>
      <&=@/components/Icon
        className='bi-arrow-counterclockwise'
        onClick={refetch}
        isBtn
        text={'reload'}
        size='normal'
      />
    </div>}
  </div>
}
