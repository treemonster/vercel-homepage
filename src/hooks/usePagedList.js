import React from 'react'
import {fetch} from '@/utils/fetch'
import {createUseShareStateGroup} from '@/hooks/useShareState'

export function usePagedList(searchText) {
  const useShareState=createUseShareStateGroup('usePagedListStore#'+searchText, true)

  const [list, set_list]=useShareState({_: []})
  const [loading, set_loading]=useShareState(false)
  const [end, set_end]=useShareState(false)

  const loadNextPage=async ({lastValidId, lastPayloadId})=>{
    if(loading || end) return;
    set_loading(true)
    try{
      const {list: nextList, isEnd}=await fetch('/content/list', {
        id: list._[list._.length-1]?.id || lastPayloadId,
        lastValidId,
        searchText,
      })
      set_list({_: list._.concat(nextList)})
      isEnd && set_end(isEnd)
    }catch(e) {}
    set_loading(false)
  }

  return {
    pagedList: list._,
    isLoading: loading,
    isEnd: end,

    watches: [list],
    loadNextPage,
  }
}
