import React from 'react'
import {createUseShareStateGroup} from '@/hooks/useShareState'
import {getContentById} from './useContent'

export function useSearchState() {
  const useShareState=createUseShareStateGroup('USE_SEARCH_STORE')
  const [searchText, set_searchText]=useShareState('')
  const [confirmSearchText, set_confirmSearchText]=useShareState('')

  const filterBySearchText=list=>{
    return list.filter(x=>{
      const {
        title=x.title,
        content=x.content,
      }=getContentById(x.id)
      return title.indexOf(searchText)>-1 || content.indexOf(searchText)>-1
    })
  }

  React.useEffect(_=>{
    let t=setTimeout(_=>{
      set_confirmSearchText(searchText)
    }, 1e2)
    return _=>{
      clearTimeout(t)
    }
  }, [searchText])

  return {
    searchText,
    set_searchText,
    filterBySearchText,
    confirmSearchText,
  }
}
