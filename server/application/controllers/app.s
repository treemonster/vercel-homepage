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

  async setupAction() {
    const models=[AppModel, ContentModel]
    const $db=new Lib_psql
    const {sqlHelper}=await $db.opening
    const sql=sqlHelper({log: true})
    await sql.query(models.map(v=>v.sql).join('\n\n'))
    return {
      success: true
    }
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
