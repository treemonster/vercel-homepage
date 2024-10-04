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
    if(__SSR_TIMEOUT__) return;
    if(!__IS_SSR__) {
      setResponseHeaders({
        'x-response-api-cost': Date.now()-this._start,
      })
    }
    if(err) {
      Lib_response.json({error: err})
    }else{
      Lib_response.json({data: ret, error: null})
    }
  }
}
