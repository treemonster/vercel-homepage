<?js

// https://node-postgres.com/apis/client

class Lib_psql{
  constructor() {
    this.opening=this.open()
    defer(_=>this.close())
  }
  async _getClient() {
    const {Pool, Client}=require('pg')
    const {$POOL_CONFIG, $CLIENT_CONFIG, $USE_POOL}=include(__PG_CONFIG__)
    if($USE_POOL) {
      if(!Application.PgConnPool) {
        const pool=new Pool($POOL_CONFIG)
        Application.PgConnPool=pool
      }
      const {waitingCount, idleCount, expiredCount, totalCount}=Application.PgConnPool
      const client=await Application.PgConnPool.connect()
      this._free=_=>client.release()
      return client
    }else{
      const client=new Client($CLIENT_CONFIG)
      this._free=_=>client.end()
      await client.connect()
      return client
    }
  }
  async open() {
    const client=await this._getClient()
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
    if(!this._free) return;
    await this._free()
    this._free=null
  }
}
