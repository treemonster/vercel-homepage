
export function autoCleanList(arr, visit, create, MAX_LEN=5, MAX_GC_PERCENTANGE=.6) {
  let find=null
  for(let i=arr.length; i--; ) {
    if(!visit(arr[i])) continue
    find=arr.splice(i, 1)[0]
    break
  }
  if(!find) find=create()
  arr.push(find)
  if(Math.random()<MAX_GC_PERCENTANGE && arr.length>MAX_LEN) {
    arr.splice(0, arr.length-MAX_LEN)
  }
  return find
}
