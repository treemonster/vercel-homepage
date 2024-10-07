#ifndef IS_NODE_TARGET
import {sleep, withResolvers} from './base'
async function _fetch_1(url, option={}) {
  let {body, headers={}, timeout=10e3}=option
  if(!url) throw new Error('url is required')

  let bodyParam
  if(body.constructor===FormData) {
    bodyParam=body
  }else{
    headers=Object.assign({'Content-Type': 'application/x-www-form-urlencoded'}, headers)
    bodyParam=''
    if(body && Object.keys(body).length>0) {
      const strigifyParam=Object.keys(body)
        .map((key)=>body[key]===undefined? '': `${key}=${encodeURIComponent(body[key])}`)
        .filter(Boolean)
        .join('&')
      bodyParam+=strigifyParam
    }
  }

  const ret=await Promise.race([
    window.fetch(url, {
      method: 'POST',
      headers,
      mode: 'cors',
      body: bodyParam,
      credentials: 'include',
    }),
    sleep(timeout).then(_=>new Error('Network hung up'))
  ])

  if(ret instanceof Error) throw ret

  return {
    statusCode: ret.status,
    responseHeaders: typeof ret.headers.values==='function'?
      [...ret.headers].reduce((o, [k, v])=>{
        if(o[k]===undefined) o[k]=v
        else{
          if(!Array.isArray(o[k])) o[k]=[o[k]]
          o[k].push(v)
        }
        return o
      }, {}): ret.headers,
    responseJSON: await ret.json(),
  }

}

const _mix={_: [], keys: {}, t: 0}
async function _fetch_mix(url, body, key=null) {
  clearTimeout(_mix.t)
  const retDefer=withResolvers()
  const fd={retDefer, url, body}
  if(key) {
    if(_mix.keys[key]) {
      _mix.keys[key].retDefer.reject(new Error('cancelled'))
    }
    _mix.keys[key]=fd
  }else{
    _mix._.push(fd)
  }
  _mix.t=setTimeout(async ()=>{
    let _=[], r=[]
    const _handler=({retDefer, url, body})=>{
      r.push(retDefer)
      _.push([url, body])
    }
    for(let t of _mix._) _handler(t)
    for(let key in _mix.keys) _handler(_mix.keys[key])
    Object.assign(_mix, {_: [], keys: {}, t: 0})
    try{
      const {responseJSON}=await _fetch_1('/mix', {body: {_: JSON.stringify(_)}})
      const {data, error}=responseJSON
      if(error) throw error
      for(let i=0; i<r.length; i++) {
        r[i].resolve({responseJSON: data[i]})
      }
    }catch(e) {
      for(let p of r) {
        p.reject(e)
      }
    }
  }, 2e2)
  return retDefer.promise
}

async function _fetch(url, option, key=null) {
  if(option?.disableMix) return _fetch_1(url, option)
  return _fetch_mix(url, option?.body, key)
}

#else

async function _fetch(...e) {
  return ServerFetch(...e)
}

#endif

export async function fetch(action, argv, key) {
  try{
    const o=await _fetch(action, {body: argv || {}}, key)
    if(o.responseJSON.error) throw new Error(o.responseJSON.error)
    return o.responseJSON.data
  }catch(e) {
    throw e
  }
}
