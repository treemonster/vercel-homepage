<?js
class mixController extends apiController{
  checkActionPermission() {
    return true
  }
  async indexAction() {
    const {params}=this
    const {resolve, execute}=include(__ROUTER__)
    return await Promise.all(JSON.parse(params._).map(([api, ssrData={}])=>{
      return execute(resolve(api), {ssrData}).then(_=>JSON.parse(readEchoed()))
    }))
  }
}
