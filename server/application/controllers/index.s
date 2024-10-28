<?js
class indexController{
  init() {
    this._start=Date.now()
  }
  async ssrAction() {
    const ssr=new Lib_ssr
    await ssr.render()
    return readEchoed()
  }
  async assetsAction() {
    const fn='/'+$_REQUEST_FILE['subRoute'][1]
    const path=require('path')
    const fs=require('fs')

    const _fn=__WEB__+'/'+path.resolve(fn)

    const m=new Date(fs.statSync(_fn).mtime).toUTCString()
    setResponseHeaders({'last-modified': m})
    if($_RAW_REQUEST['headers']['if-modified-since']===m) {
      setStatus(304, 'not modified')
      return
    }

    return new Promise(done=>{
      const rs=fs.createReadStream(_fn)
      defer(_=>rs.close())
      const mime=({
        '.js': 'application/x-javascript',
        '.css': 'text/css',
        '.jpg': 'image/jpeg',
        '.png': 'image/png',
        '.jpeg': 'image/jpeg',
      })[path.parse(fn).ext] || 'application/octet-stream'
      setResponseHeaders({
        'content-type': mime,
        'content-length': fs.statSync(_fn).size,
        'expires': 'Sun, 09 Dec 2035 09:13:56 GMT',
      })
      rs.on('data', buf=>echo(buf))
      rs.on('end', done)
      rs.on('error', done)
    })
  }
  finish(err, ret) {
    setResponseHeaders({
      'x-response-cost': Date.now()-this._start,
    })
    if(!err) {
      echo(ret)
      return
    }
    echo(isDebug()? err.stack: 'failed to handle this request')
  }
}
