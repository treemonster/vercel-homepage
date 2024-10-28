import React from 'react'

export function createStoreValue(v0) {
  const ref={
    val: typeof v0==='function'? v0(): v0,
    funcs: new Set,
  }
  const e={
    use: _=>{
      const {val, funcs}=ref
      const [v, set_v]=React.useState(val)
      React.useEffect(_=>{
        funcs.add(set_v)
        return _=>{
          funcs.delete(set_v)
        }
      }, [])
      const update_v=nv=>{
        ref.val=nv
        for(const f of funcs) f(nv)
      }
      return [v, update_v]
    },
    set: v=>{
      ref.val=v
      for(let setter of ref.funcs) {
        setter(v)
      }
    },
    val: _=>ref.val,
  }
  e.useVal=_=>e.use()[0]
  return e
}
