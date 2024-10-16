import React from 'react'
import './index.scss'

export default function(props) {
  const {
    className='',
    isEnd: _isEnd,
    prevState: _state,
    render,
    loadNextPage,
    watches=[],
  }=props
  const [isEnd, set_isEnd]=React.useState(_isEnd || false)
  const [isLoading, set_isLoading]=React.useState(false)
  const [state, set_state]=React.useState(_state || {})
  const [errCount, set_errCount]=React.useState(0)

  return <div className={'__view_scope '+className}>
    {React.useMemo(_=>render(state, {isEnd}), [state, isEnd, ...watches])}
    <LoadMore manual={errCount>0} isEnd={isEnd} isLoading={isLoading} loadNextPage={async _=>{
      set_isLoading(true)
      try{
        const {isEnd, nextState}=await loadNextPage(state)
        set_state(nextState)
        set_isEnd(isEnd)
        set_errCount(0)
      }catch(e) {
        set_errCount(errCount+1)
      }
      set_isLoading(false)
    }} />
  </div>
}


function LoadMore(props) {
  const {isEnd, isLoading, loadNextPage, manual}=props
  if(isEnd) return null
  return <div className='load-more'>
    {(_=>{
      if(isLoading) return <&=@/components/Loading />
      if(manual) return <&=@/components/Icon
        isSimpleBtn
        size='large'
        className='bi-chevron-double-down'
        onClick={loadNextPage}
      />
      return <&=@/components/Expose
        onVisible={loadNextPage}
        children={<&=@/components/Loading />}
      />
    })()}
  </div>
}
