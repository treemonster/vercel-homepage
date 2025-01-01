import Toast from '@/components/Toast'
import {withResolvers} from './base'
import * as historyAction from '@/hooks/useHistoryAction'

export async function asyncTaskWithToast({beginText, doneText}, task, cb) {
  Toast.show(beginText)
  try{
    await task
    Toast.show(doneText)
    cb?.()
  }catch(e) {
    Toast.show(e.message)
  }
}

export function waitGoBack() {
  const {hookPopStateFunc}=historyAction
  if(hookPopStateFunc.current) return;
  const def=withResolvers()
  history.pushState(history.state, null, location.href)
  hookPopStateFunc.current=_=>{
    def.resolve()
  }
  const curr=hookPopStateFunc.current
  const onGoBacked=fn=>{
    def.promise.then(fn)
  }
  const cancel=_=>{
    if(curr!==hookPopStateFunc.current) return;
    hookPopStateFunc.current=null
    historyAction.goBack()
  }
  return [cancel, onGoBacked, def.promise]
}
