<?js

const ID_HEADER=1
const ID_LINKS=2
const ID_FOOTER=3

class AppModel extends Lib_psql{

  static sql=`
  DROP TABLE if exists app;
  CREATE TABLE app (
    id SERIAL PRIMARY KEY,
    text TEXT
  );
  INSERT INTO app(id, text) VALUES
    (${ID_HEADER}, '# Header'),
    (${ID_LINKS}, '[Home](/)'),
    (${ID_FOOTER}, '# Footer');
  `

  async _update(id, value) {
    const {sqlHelper}=await this.opening
    const sql=sqlHelper({log: true})
    await sql.query(`update app set text=${sql.quota(value)} where id=${id}`)
  }

  async _get(id) {
    const {sqlHelper}=await this.opening
    const sql=sqlHelper({log: true})
    const {rows}=await sql.query(`select text from app where id = ${id} limit 1`)
    return rows[0].text
  }

  async editHeader(header) {
    return this._update(ID_HEADER, header)
  }

  async editHeaderLeftText(headerLeftText) {
    return this._update(ID_LINKS, headerLeftText)
  }

  async editFooter(footer) {
    return this._update(ID_FOOTER, footer)
  }

  async getHeader() {
    return this._get(ID_HEADER)
  }

  async getHeaderLeftText() {
    return this._get(ID_LINKS)
  }

  async getFooter() {
    return this._get(ID_FOOTER)
  }

}
