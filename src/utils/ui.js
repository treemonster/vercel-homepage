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

export async function isSupportSticky() {
  const e=document.createElement('div')
  e.style.cssText=`
    position: sticky;
    width: 0;
    height: 0;
    top: 200px;
    left: 0;
  `
  document.body.insertBefore(e, document.body.childNodes[0])
  return new Promise(resolve=>{
    setTimeout(_=>{
      resolve(e.offsetTop>=200)
      document.body.removeChild(e)
    }, 200)
  })
}
