import React from 'react'
import {createUseShareStateGroup} from '@/hooks/useShareState'
import {getContentById} from './useContent'
import {parseUrl} from '@/utils/url'

export function getSearchTextFromURL() {
  return parseUrl().query?.s || ''
}

export function useSearchState() {
  const useShareState=createUseShareStateGroup('USE_SEARCH_STORE')
  const [searchText, set_searchText]=useShareState(getSearchTextFromURL)
  const [confirmSearchText, set_confirmSearchText]=useShareState(getSearchTextFromURL)

  React.useEffect(_=>{
    let t=setTimeout(_=>{
      if(confirmSearchText===searchText) return;
      set_confirmSearchText(searchText)
    }, 5e2)
    return _=>{
      clearTimeout(t)
    }
  }, [searchText])

  return {
    searchText,
    set_searchText,
    confirmSearchText,
    set_confirmSearchText: text=>{
      if(text!==searchText) set_searchText(text)
      set_confirmSearchText(text)
    },
  }
}
