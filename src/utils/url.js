
export function buildUrl(x, params) {
  let r=[]
  for(let k in params) {
    r.push(k+'='+encodeURIComponent(params[k]))
  }
  if(x.indexOf('?')===-1) {
    x+='?'
  }else if(!x.endsWith('&')) {
    x+='&'
  }
  x+=r.join('&')
  return x.replace(/\?$/, '')
}

export function parseUrl(x) {
  x=x || location.href
  const ret={query: {}, pathname: null}
  try{
    ret.pathname=x.replace(/^((https?:)?\/\/[^/]+)|\?.+/g, '')
    const r=x.indexOf('?')
    if(r<0) throw 1
    for(let v of x.substr(r+1).split('&')) {
      const [a, b]=v.split('=').map(x=>decodeURIComponent(x))
      ret.query[a]=b
    }
  }catch(e) {}
  return ret
}
