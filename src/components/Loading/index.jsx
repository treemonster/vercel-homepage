import React from 'react'
import './index.scss'
export default function(props) {
  let {
    isLoading=false,
    isRetry=false, retryFunc,
    isBlock=false,
  }=props
  let r=null
  if(isLoading) r=<Loading />
  else if(isRetry && retryFunc) r=<Retry retryFunc={retryFunc} />
  return <div className={[
    '__view_scope',
    isBlock && 'block',
  ].filter(Boolean).join(' ')}>
    {r}
  </div>
}

function Loading(props) {
  return <&=@/components/Icon
    className='bi-sun'
    isRotating
    size='large'
  />
}

function Retry(props) {
  const {retryFunc}=props
  return <div className='error'>
    <h3 className='title'>
      <&=@/components/Icon
        className='bi-emoji-surprise'
      /> Network error.
    </h3>
    <&=@/components/Icon
      className='bi-arrow-counterclockwise'
      onClick={retryFunc}
      isBtn
      text={'reload'}
      size='normal'
    />
  </div>
}
