<?js
class apiController{
  async init(e) {
    const {arguments: a}=e
    const req=new Lib_request(a[0]? a[0].ssrData: null)
    this.params=await req.getRequestData()
    if(!this.checkActionPermission(e.Action)) {
      throw new Error('permission denied')
    }
    this._start=Date.now()
  }
  finish(err, ret) {
    if(Lib_ssr.__IS_SSR_PAYLOAD_TIMEOUT__) return;
    const isServerFetch=Lib_ssr.__IS_SSR__
    const res={
      data: ret || null,
      error: err? err.message || 'unknown error': null,
    }
    if(isServerFetch) return res
    setResponseHeaders({
      'content-type': 'application/json; charset=utf8',
      'x-response-api-cost': Date.now()-this._start,
    })
    echo(JSON.stringify(res))
  }

}
