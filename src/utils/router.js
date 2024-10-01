import {useVar} from './base'
export {getPageRef, isCurrent} from '@/AppRouter'

const ROUTERSTORE_KEY='ROUTERSTORE_KEY'
export function setRouter(Router, router) {
  useVar(ROUTERSTORE_KEY, {}).v=[Router, router]
}
function _resolve(fn, params, type) {
  const [Router, router]=useVar(ROUTERSTORE_KEY, {}).v
  if(fn) {
    const url=fn(Router)
    router[type](url?.href || url, params || {})
  }else{
    router[type]()
  }
}

export function pushUrl(fn, params) {
  _resolve(fn, params, 'pushUrl')
}
export function replaceUrl(fn, params) {
  _resolve(fn, params, 'replaceUrl')
}
export function goBack() {
  _resolve(null, null, 'goBack')
}
export function goForward() {
  _resolve(null, null, 'goForward')
}
