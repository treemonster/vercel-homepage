<?js

class ContentModel extends Lib_psql{

  static sql=`
  DROP TABLE IF EXISTS content;
  CREATE TABLE content (
    id SERIAL PRIMARY KEY,
    title TEXT UNIQUE,
    tags TEXT,
    content TEXT,
    create_at BIGINT
  );
  `

  async create(title, tags, content, create_at) {
    const {sqlHelper}=await this.opening
    const sql=sqlHelper({log: true})
    await sql.query(`insert into content (

      title,
      tags,
      content,
      create_at

    ) values (

      ${sql.quota(title)},
      ${sql.quota(tags)},
      ${sql.quota(content)},
      ${sql.quota(create_at)}

    )`)
  }

  async title2id(title) {
    const {sqlHelper}=await this.opening
    const sql=sqlHelper({log: true})
    const {rows}=await sql.query(`select id from content where title=${sql.quota(title)} limit 1`)
    return (rows[0] || {}).id
  }

  async detail(id) {
    const {sqlHelper}=await this.opening
    const sql=sqlHelper({log: true})
    const {rows}=await sql.query(`
      select id, title, tags, content, create_at from content
    	where id = ${sql.quota(id)}
      limit 1`)
    return rows[0]
  }

  async update(id, {
    title=null,
    tags=null,
    content=null,
    create_at=0,
  }) {
    const {sqlHelper}=await this.opening
    const sql=sqlHelper({log: true})
    let _sql='update content set '
    _sql+=[
      title && `title=${sql.quota(title)}`,
      tags && `tags=${sql.quota(tags)}`,
      content && `content=${sql.quota(content)}`,
      create_at && `create_at=${sql.quota(create_at)}`,
    ].filter(Boolean).join(',')
    _sql+=` where id=${sql.quota(id)}`
    await sql.query(_sql)
  }

  async delete(id) {
    const {sqlHelper}=await this.opening
    const sql=sqlHelper({log: true})
    await sql.query(`delete from content where id = ${sql.quota(id)}`)
  }

  _filterBySearchText(sql, searchText) {
    if(searchText!=='') {
      if(searchText.indexOf('tag: ')===0) {
        const tag=searchText.substr(5)
        return `concat(tags, ', ') LIKE ${sql.quota('%'+tag+', %')}`
      }
      return `concat(title, '\n', tags, '\n', content) LIKE ${sql.quota('%'+searchText+'%')}`
    }
  }

  async list({
    id,
    count,
    desc=false,
    except_current_id=true,
    summary=false,
    searchText='',
  }) {
    const {sqlHelper}=await this.opening
    const sql=sqlHelper({log: true})
    let _sql=`select id, title, tags, `
    if(summary) {
      _sql+=`LEFT(content, 100) as content`
    }else{
      _sql+=`content`
    }
    _sql+=`, create_at from content `
    let and=[]
    if(id>0) and.push(`id ${desc? '<': '>'}${except_current_id? '': '='} ${sql.quota(id)}`)
    if(searchText!=='') and.push(this._filterBySearchText(sql, searchText))
    if(and.length) _sql+=` where `+and.join(' and ')
    _sql+=` order by id ${desc? 'desc': 'asc'} limit ${sql.quota(count)} `
    const {rows}=await sql.query(_sql)
    if(summary) {
      for(let o of rows) {
        o.content=o.content.replace(/\n[^\n]+$/, '')
        const r=o.content.match(/```/g)
        if(r && r.length%2) {
          o.content=o.content.substr(0, o.content.lastIndexOf('```'))
        }
      }
    }
    return rows
  }

  async lastValidId({
    desc=false,
    searchText='',
  }) {
    const {sqlHelper}=await this.opening
    const sql=sqlHelper({log: true})
    let _sql=`select id from content `
    if(searchText) _sql+=` where `+this._filterBySearchText(sql, searchText)
    _sql+=` order by id ${desc? 'asc': 'desc'}`
    const {rows}=await sql.query(_sql)
    return (rows[0] || {}).id
  }

}
