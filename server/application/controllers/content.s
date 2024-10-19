<?js

class contentController extends apiController{

  async init(e) {
    await super.init(e)
    this.model=new ContentModel
  }

  checkActionPermission(action) {
    if(!__READONLY__) return true
    return [
      'getLastIdAction',
      'listAction',
      'detailAction',
    ].includes(action)
  }

  async getLastIdAction() {
    const {params, model}=this
    const {searchText=''}=params
    return {
      id: await model.lastValidId({desc: true, searchText}),
    }
  }

  async listAction() {
    const {params, model}=this
    const {id, lastValidId, searchText=''}=params
    const queryCount=5
    const list=await model.list({
      id: +id,
      count: queryCount,
      desc: true,
      except_current_id: true,
      summary: true,
      searchText,
    })
    const isEnd=list.length<queryCount || +lastValidId === (list[list.length-1] || '').id
    return {list, isEnd}
  }

  async updateAction() {
    const {params, model}=this
    const {id, title, tags, content}=params
    await model.update(+id, {title, tags, content})
    return {
      summary: model.content2summary(content),
    }
  }

  async detailAction() {
    const {model, params}=this
    return await model.detail(+params.id)
  }

  async deleteAction() {
    const {model, params}=this
    await model.delete(+params.id)
  }

  async createAction() {
    const {model, params}=this
    const {title, tags, content}=params
    const create_at=Date.now()
    await model.create(title, tags, content, create_at)
    return {
      id: await model.title2id(title),
      create_at,
      summary: model.content2summary(content),
    }
  }

}
