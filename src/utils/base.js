
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
  return window.constructor===Object
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
