import {createStoreValue} from '@/hooks/useStore'
import {buildUrl} from '@/utils/url'
import {isNodeSide} from '@/utils/base'

const HISTORY_VERSION=Date.now()
const initActionType={
  t: 0,
  isInit: true,
  isIn: false,
  isOut: false,
  isInReplace: false,
  version: HISTORY_VERSION,
}
const actionType=createStoreValue(_=>{
  if(!isNodeSide()) {
    window.addEventListener('popstate', e=>{
      updateActionType(e.state || initActionType, false)
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
  })
}

export function pushUrl(x, params) {
  const e={
    t: Date.now(),
    action: 'push',
    version: HISTORY_VERSION,
  }
  history.pushState(e, null, buildUrl(x, params))
  updateActionType(e, true)
}
export function replaceUrl(x, params) {
  const e={
    t: Date.now(),
    action: 'replace',
    version: HISTORY_VERSION,
  }
  history.replaceState(e, null, buildUrl(x, params))
  updateActionType(e, true)
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
