<?js

class appController extends apiController{

  async init(e) {
    await super.init(e)
    this.model=new AppModel
  }

  checkActionPermission(action) {
    if(!__READONLY__) return true
    return [
      'isReadOnlyAction',
      'headerAction',
      'headerLeftTextAction',
      'footerAction',
    ].includes(action)
  }

  getModels() {
    return [AppModel, ContentModel]
  }
  async setupAction() {
    const models=this.getModels()
    const $db=new Lib_psql
    const {sqlHelper}=await $db.opening
    const sql=sqlHelper({log: true})
    await sql.query(models.map(v=>v.sql).join('\n\n'))
    return {
      success: true
    }
  }
  async backupAction() {
    const models=this.getModels()
    const tables=models.reduce((a, b)=>a.concat(b.tables), [])
    const $db=new Lib_psql
    const {sqlHelper}=await $db.opening
    const sql=sqlHelper({log: true})
    const ret={}
    for(const table of tables) {
      const {rows}=await sql.query(`select * from ${table}`)
      ret[table]=rows
    }
    this.disableAutoJSONHeader()
    setResponseHeaders({
      'content-type': 'application/octet-stream',
      'content-disposition': 'attachment; filename="backup-'+Date.now()+'.json"',
    })
    return ret
  }

  async isReadOnlyAction() {
    return {
      readOnly: __READONLY__,
    }
  }

  async headerAction() {
    const {params, model}=this
    return {
      md: await model.getHeader()
    }
  }

  async headerLeftTextAction() {
    const {params, model}=this
    return {
      md: await model.getHeaderLeftText()
    }
  }

  async footerAction() {
    const {params, model}=this
    return {
      md: await model.getFooter()
    }
  }

  async saveHeaderAction() {
    const {params, model}=this
    await model.editHeader(params.text)
  }

  async saveHeaderLeftTextAction() {
    const {params, model}=this
    await model.editHeaderLeftText(params.text)
  }

  async saveFooterAction() {
    const {params, model}=this
    await model.editFooter(params.text)
  }

}
