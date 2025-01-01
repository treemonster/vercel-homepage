
export function withResolvers() {
  let resolve, reject;
  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  return { promise, resolve, reject };
}

// @csrOnlyFunction
export function sleep(t) {
  return new Promise((r) => setTimeout(r, t));
}

export function isNodeSide() {
#ifdef IS_NODE_TARGET
  return true
#endif
}

const csrWindow={}
const _useVarKey=Symbol()
export function useVar(key, initialValue = {}) {
  const _window=isNodeSide()? (_=>{
    window._windowObject=window._windowObject || {}
    return window._windowObject
  })(): csrWindow
  _window[_useVarKey] = _window[_useVarKey] || {};
  return (_window[_useVarKey][key] =
    _window[_useVarKey][key] ||
    ((any) => {
      if (typeof any === 'function') {
        return any();
      } else {
        return any;
      }
    })(initialValue));
}

export function assert(x) {
  if(!x) throw new Error(`Uncaught AssertionError [ERR_ASSERTION]: ${x} == true`)
}

const scripts={}
// @csrOnlyFunction
export async function loadScript(src) {
  if(!scripts[src]) {
    scripts[src]=withResolvers()
    const curr=scripts[src]
    const s=document.createElement('script')
    s.type='text/javascript'
    s.src=src
    s.onload=_=>{
      curr.resolve()
      document.body.removeChild(s)
    }
    s.onerror=_=>{
      curr.reject()
      delete scripts[src]
      document.body.removeChild(s)
    }
    const t=setTimeout(_=>{
      s.onerror()
    }, 5e3)
    curr.promise.then(_=>{
      clearTimeout(t)
    })
    document.body.appendChild(s)
  }
  return scripts[src].promise
}

const cssLinks={}
// @csrOnlyFunction
export function appendCssLink(src) {
  if(!cssLinks[src]) {
    cssLinks[src]=true
    const css=document.createElement('link')
    css.rel='stylesheet'
    css.href=src
    document.body.appendChild(css)
  }
}

const _locks={}
export function createLock(key) {
  return {
    lock: _=>{
      _locks[key]=true
    },
    unlock: _=>{
      delete _locks[key]
    },
    locked: _=>{
      return _locks[key]
    },
  }
}
