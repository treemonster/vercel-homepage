/*
const PORT = process.env.PORT || 3000;
const http=require('http')
http.createServer((req, res)=>{
  res.end('This is a test Page. The project is developing. - '+Date.now())
}).listen(PORT)
*/
process.argv.push(
  '-p'+(process.env.PORT || 3000),
  '-w'+__dirname+'/app',
  '-rindex.s',
)
require('sptc/bin/sptcd')
