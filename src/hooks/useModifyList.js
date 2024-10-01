import {useShareState} from '@/hooks/useShareState'
const STORE_PREFIX='useModifyListStore'

export function useCreateList() {
  const [list, set_list]=useShareState(STORE_PREFIX+'/useCreateList', {_: []})
  const addNew=li=>{
    list._.unshift(li)
    set_list({_: list._})
  }
  return {
    createList: list._,
    watches: [list],
    addNew,
  }
}

export function useDeleteContent() {
  const [deletes, set_deletes]=useShareState(STORE_PREFIX+'/useDeleteContent', {_: new Set})
  const filterDeleted=arr=>arr.map(x=>deletes._.has(x.id)? null: x).filter(Boolean)
  const deleteById=id=>{
    deletes._.add(id)
    set_deletes({_: deletes._})
  }
  return {
    watches: [deletes],
    deleteById,
    filterDeleted,
  }
}
