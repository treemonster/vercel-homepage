const {getRuntimeArgv, checkEnv, run}=require(__dirname+'/lib')
checkEnv()
const {IS_DEV, IS_BUILD, IS_SERVE, NPM_ARGV_ORIGINAL}=getRuntimeArgv()

process.env.NODE_ENV=IS_DEV? 'development': 'production'
const {webpackDev, webpackBuild}=require(__dirname+'/webpack.lib')

const nk='NODE_OPTIONS', nv='--openssl-legacy-provider'
if(+process.version.match(/^v(\d+)/)[1]>16 && process.env[nk]!==nv) {
  run('cross-env', [nk+'='+nv, 'npm', ...NPM_ARGV_ORIGINAL])
}else{
  const open=require('open')
  if(IS_DEV) {
    run('cross-env', 'myblog_environ=dev myblog_write=on sptcd -rindex.s -wserver'.split(' '))
    webpackDev()
    open('http://127.0.0.1:3000')
  }else if(IS_BUILD) {
    webpackBuild()
  }
}
