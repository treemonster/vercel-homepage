<?js
class apiController{
  async init(e) {
    const {arguments: a}=e
    const req=new Lib_request(a[0]? a[0].ssrData: null)
    this.params=await req.getRequestData()
    if(!this.checkActionPermission(e.Action)) {
      throw new Error('permission denied')
    }
  }
  finish(err, ret) {
    if(__SSR_TIMEOUT__) return;
    if(err) {
      Lib_response.json({error: err})
    }else{
      Lib_response.json({data: ret, error: null})
    }
  }

}
