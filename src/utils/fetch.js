#ifndef IS_NODE_TARGET
import {sleep} from './base'
export async function _fetch(url, option={}) {
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

#else

export async function _fetch(...e) {
  return ServerFetch(...e)
}

#endif

export async function fetch(action, argv) {
  try{
    const o=await _fetch(action, {body: argv || {}})
    if(o.responseJSON.error) throw new Error(o.responseJSON.error)
    return o.responseJSON.data
  }catch(e) {
    throw e
  }
}
