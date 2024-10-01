
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

const _window = window.constructor === Object ? (window._windowObject = {}) : {};
const _useVarKey=Symbol()
export function useVar(key, initialValue = {}) {
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
