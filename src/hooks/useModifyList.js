import {useShareState} from '@/hooks/useShareState'
const STORE_PREFIX='useModifyListStore'

export function useCreateList() {
  const [list, set_list]=useShareState(STORE_PREFIX+'/useCreateList', [])
  const addNew=li=>{
    list.unshift(li)
    set_list([...list])
  }
  return {list, addNew}
}

export function useDeleteContent() {
  const [deletes, set_deletes]=useShareState(STORE_PREFIX+'/useDeleteContent', [])
  const filterDeleted=arr=>arr.map(x=>deletes.includes(x.id)? null: x).filter(Boolean)
  const deleteById=id=>{
    if(deletes.includes(id)) return;
    deletes.push(id)
    set_deletes([...deletes])
  }
  return {deletes, deleteById, filterDeleted}
}
