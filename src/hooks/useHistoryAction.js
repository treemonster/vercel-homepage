import {createStoreValue} from '@/hooks/useStore'
import {buildUrl} from '@/utils/url'
import {isNodeSide} from '@/utils/base'

export const hookPopStateFunc={current: null}

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
      if(hookPopStateFunc.current) {
        hookPopStateFunc.current()
        hookPopStateFunc.current=null
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
