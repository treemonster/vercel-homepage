const argv=require('./lib').getRuntimeArgv()

function is_server(ctx) {
  return (ctx.webpackLoaderThis.target + '').indexOf('node') > -1;
}

const watches={}, watchListeners={}
function autoTouchByChanges(touchFile, watchFiles) {
  if(!argv.IS_DEV) return;
  const fs=require('fs')
  for(let fn of watchFiles) {
    watches[fn]=watches[fn] || new Set
    watches[fn].add(touchFile)
  }
  for(let fn in watches) {
    if(watchListeners[fn]) continue
    watchListeners[fn]=true
    fs.watch(fn, _=>{
      for(let t of watches[fn].keys()) {
        fs.utimesSync(t, new Date(), new Date())
      }
    })
  }
}

const A={
  EXTENDS: (ctx) => ({
    ...argv,
    IS_NODE_TARGET: is_server(ctx),
    SRC: __dirname+'/../src',
    autoTouchByChanges,
  }),
  TPLS: [
    /\.jsx?$/, ctx=>{
      let {str}=ctx
      if(str.match(/^\/\/\s+@csrWidget\b/) && is_server(ctx)) {
        return `export default {}`
      }
      return str
    },

    /\.jsx?$/, ctx=>{
      let {str, fn}=ctx
      let appends={}
      if (str.match(/<&[*=]/)) {
        str=str.replace(/<(\/)?&([*=&])([^\s>]+)/g, (_, b, a, p) => {
          appends[`import UseComponent from '@/components/UseComponent'`]=1
          if(a==='*') {
            if(b) return `</UseComponent`
            return `<UseComponent UseComponentGetter={_=>import("${p}")}`
          }else if(a==='=') {
            appends[`import UseComponent from '@/components/UseComponent'`]=1
            if(b) return `</UseComponent`
            return `<UseComponent UseComponentSync={true} UseComponentGetter={_=>require("${p}")}`
          } else if(a==='&') {
            const name = `Comp_pathto_component_${p.replace(/[^a-z\d_]+/g, '_')}`
            appends[`import ${name} from '${p}'`]=1
            if(b) return `</${name}`
            return `<${name}`
          }
        })
        str=Object.keys(appends).join('\n')+'\n'+str
      }
      return str;
    },

    /\.jsx?$/, ctx=>{
      let {str}=ctx
      if(is_server(ctx)) {
        str=str.replace(/(?:^|\n)\/\/\s+@csrOnlyFunction\b[\s\S]+?\{/g, x=>x+`
          (x=>{
            const e=new Error(x)
            console.log(e.stack)
            throw e
          })("This function should not be called in Server Side Render.");
        `)
      }
      return str
    },

    /\.jsx?$/, ctx=>{
      let adds={}
      let str=ctx.str.replace(/\*IMG\((['"])(.+?)\1\)/g, (_, a, pth)=>{
        let e='IMG_'+pth.replace(/[^a-z\d_]+/g, '_')
        adds[e]=pth
        return e
      })
      for(let e in adds) {
        str=`import ${e} from '${adds[e]}'\n`+str
      }
      return str
    },

    /\.(scss|jsx?)/, ctx=>{
      const {str, fn}=ctx
      const path=require('path')
      const src=path.resolve(__dirname+'/src')
      const ffn=path.resolve(fn).substr(src.length).replace(/\.[a-z\d]+$/, '')
      let t=ffn.replace(/[\/\\]+([^/\\]+)\.[^/\\]+$/, '').replace(/[^a-z\d_-]/ig, '_')
      return str.replace(/\b__view_scope\b/g, 'V_'+argv.RND+'_'+t)
    },

    /\.jsx?/, ctx=>{
      const {str, fn}=ctx
      return str.replace(/(?:^|\n)\s*enum\s*\{([^}]+)\}/g, (_, e)=>{
        let ret=[]
        e.replace(/\/\*[\s\S]*?\*\/|\/\/.+/g, '').split(',').map(x=>{
          x=x.trim()
          if(x) ret.push(`const ${x}="${x}";`)
        })
        return '\n'+ret.join('\n')+'\n'
      })
    },

  ],
};

module.exports=A
