<?js

const {$error, $alias, $index_action, $max_redirect=3}=include(__ROUTER_SETTING__)

function resolve(pathname, maxRedirect=$max_redirect) {
  if(maxRedirect<=0) throw new Error('redirect max exceeded')
  let _pathname=pathname
  for(let a in $alias) {
    let p=a.replace(/\*/g, '(.*?)')
    const sub=pathname.match(new RegExp('^'+p+'$'))
    if(sub) {
      _pathname=$alias[a]
      if(_pathname.indexOf('$')>-1) {
        const r1=_pathname.replace(/\$(\d+)/g, (_, n)=>sub[+n] || _)
        if(isDebug()) {
          console.log('Redirect:', {
            from: pathname,
            to: r1,
          })
        }
        return resolve(r1, maxRedirect-1)
      }
      $_REQUEST_FILE['subRoute']=sub
      break
    }else if(a===pathname) {
      _pathname=$alias[a]
      break
    }
  }
  return _pathname
}

async function _call(x, ...e) {
  if(!x) return;
  const $c=x.substr(1, x.indexOf('/', 1)-1) || x.substr(1)
  const c_len=2+$c.length
  const $a=x.substr(c_len, (x+'/').indexOf('/', c_len)-c_len) || $index_action
  const c=include(__APP__+'/controllers/'+$c+'.s')[$c+'Controller']
  const argv={
    pathname: $_REQUEST_FILE['pathname'],
    Controller: $c,
    Action: $a+'Action',
    arguments: e,
  }
  if(isDebug()) {
    console.log('Request:', argv)
  }
  const _c=new c(...e)
  const _c_func=x=>typeof _c[x]==='function'? _c[x].bind(_c): 0

  const _init=_c_func('init')
  let initError=null
  if(_init) {
    try{
      await _init(argv)
    }catch(e) {
      if(isDebug()) console.log('Error in init: ', e)
      initError=e
    }
  }

  const _finish=_c_func('finish')
  try{
    if(initError) throw initError
    const ret=await _c[argv.Action]()
    if(_finish) await _finish(null, ret)
    return ret
  }catch(e) {
    if(_finish) await _finish(e, null)
    else throw e
  }

}

async function execute(pathname, ...argv) {
  const unlock=Sync.Lock()
  try{
    await _call(pathname, ...argv)
  }catch(e) {
    await _call($error, e)
  }
  unlock()
}
