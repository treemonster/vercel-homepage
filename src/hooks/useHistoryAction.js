import {createStoreValue} from '@/hooks/useStore'
import {buildUrl} from '@/utils/url'
import {isNodeSide} from '@/utils/base'

const goBackHook={
  id: null,
  func: null,
  skip: false,
}

const HISTORY_VERSION=Date.now()
const initActionType={
  t: 0,
  isInit: true,
  isIn: false,
  isOut: false,
  isInReplace: false,
  version: HISTORY_VERSION,
  nextUrl: location.pathname+location.search,
}
const actionType=createStoreValue(_=>{
  if(!isNodeSide()) {
    window.addEventListener('popstate', e=>{
      if(goBackHook.id) {
        if(goBackHook.skip) {
          goBackHook.skip=false
          goBackHook.id=null
        }else{
          releaseGoBackHook(null, true)
        }
      }else{
        updateActionType(e.state || initActionType, false)
      }
    }, false)
  }
  return initActionType
})
function updateActionType(e, isNew) {
  const oldActionTypeVal=actionType.val()
  const isIn=isNew ||
    e.t>oldActionTypeVal.t ||
    HISTORY_VERSION!==e.version ||
    e.t===initActionType.t
  actionType.set({
    t: e.t,
    isInit: false,
    isIn,
    isOut: !isIn,
    isInReplace: e.action==='replace',
    nextUrl: e.nextUrl,
  })
}

function changeUrl(x, params, isReplace) {
  const e={
    t: Date.now(),
    action: isReplace? 'replace': 'push',
    version: HISTORY_VERSION,
    nextUrl: buildUrl(x, params),
  }
  if(e.nextUrl===actionType.val().nextUrl) return;
  history[isReplace? 'replaceState': 'pushState'](e, null, e.nextUrl)
  updateActionType(e, true)
}
export function pushUrl(x, params) {
  changeUrl(x, params, false)
}
export function replaceUrl(x, params) {
  changeUrl(x, params, true)
}
export function goBack() {
  history.back()
}
export function goForward() {
  history.forward()
}
export function useActionTypeVal() {
  return actionType.use()[0]
}
export function useVal() {
  return actionType.useVal()
}

export function bindGoBackHook(id, func) {
  if(goBackHook.id) return;
  goBackHook.id=id
  goBackHook.func=func
  history.pushState(history.state, null, location.href)
}
export function releaseGoBackHook(id, fromCustomGoBack=false) {
  if(!fromCustomGoBack && goBackHook.id!==id) return;
  goBackHook.func()
  goBackHook.func=null
  if(!fromCustomGoBack) {
    goBackHook.skip=true
    goBack()
  }else{
    goBackHook.skip=false
    goBackHook.id=null
  }
}
