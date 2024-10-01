export const keys = ['document', 'navigator', 'location'];
const e = typeof window !== 'undefined'
  ? window
  : ((_) => {
      const window = {};
      window.window = window;
      for (let k of keys) window[k] = {};
      return window;
    })()
export default e
export function initRequest(ctx) {
  for (let k in e.window) {
    if (k === 'window' || keys.includes(k)) continue;
    delete e.window[k];
  }
  const {url, headers}=ctx || {}
  const NOOP=_=>undefined
  e.window.addEventListener=NOOP
  e.navigator.userAgent = headers?.['user-agent'] || 'unknown';
  e.location.href=url
  ; [, e.location.pathname, e.location.search]=url.match(/:\/\/[^/]+([^\?]+)(.*)/)
  e.document.cookie = headers?.cookie || '';
}
