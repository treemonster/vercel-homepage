<?js
class indexController{
  async ssrAction() {
    const ssr=new Lib_ssr
    await ssr.render()
  }
  async assetsAction() {
    const fn='/'+$_REQUEST_FILE['subRoute'][1]
    const path=require('path')
    const fs=require('fs')
    try{
      return new Promise(done=>{
        const _fn=__WEB__+'/'+path.resolve(fn)
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
        })
        rs.on('data', buf=>echo(buf))
        rs.on('end', done)
        rs.on('error', done)
      })
    }catch(e) {
      console.log(e)
    }
  }
}
