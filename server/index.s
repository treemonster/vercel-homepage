<?js

define('__APP__', __dirname+'/application')
define('__IS_DEV__', process.env.myblog_environ==='dev')
define('__READONLY__', process.env.myblog_write!=='on')
setDebug(__IS_DEV__)
if(__IS_DEV__) define('__DEV_WEB_DIR__', __dirname+'/..')
define('__WEB__', __dirname+'/public')
define('__PG_CONFIG__', __dirname+'/conf/pg.s')
__autoload(classname=>{
  if(classname.endsWith('Controller')) {
    return __APP__+'/controllers/'+classname.substr(0, classname.length-10).replace(/_/g, '/')+'.s'
  }
  if(classname.indexOf('Lib_')===0) {
    return __APP__+'/library/'+classname.substr(4).replace(/_/g, '/')+'.s'
  }
  if(classname.endsWith('Model')) {
    return __APP__+'/models/'+classname.substr(0, classname.length-5)+'.s'
  }
  if(classname.endsWith('Service')) {
    return __APP__+'/services/'+classname.substr(0, classname.length-7)+'.s'
  }
})
define('__ROUTER_SETTING__', __dirname+'/conf/setting.s')
define('__ROUTER__', __dirname+'/router.s')
const {resolve, execute}=include(__ROUTER__)
const pathname=resolve($_REQUEST_FILE['pathname'])
execute(pathname)
