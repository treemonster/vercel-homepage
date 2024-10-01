<?js

// https://node-postgres.com/apis/client

class Lib_psql{
  constructor() {
    const {Pool}=require('pg')
    const {$POOL_CONFIG}=include(__PG_CONFIG__)
    if(!Application.Pool) Application.Pool=new Pool($POOL_CONFIG)
    this._pool=Application.Pool
    this.opening=this.open()
    defer(_=>this.close())
  }
  async open() {
    const pool=this._pool
    const client=await pool.connect()
    this._client=client
    const sqlHelper=(option={})=>{
      const {log=false}=option
      const params=[]
      const quota=v=>{
        params.push(v)
        return '$'+params.length
      }
      const query=sql=>{
        if(log) console.log(">> psql query:", {sql, params})
        return client.query({text: sql, values: params})
      }
      return {quota, query}
    }
    return {sqlHelper}
  }
  async close() {
    if(!this._client) return;
    this._client.release()
    this._client=null
  }
}
