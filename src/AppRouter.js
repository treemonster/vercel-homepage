<?js
  const Router={}, paths=[], Router_paths_ref={}, cmds=[]
  const fs=require('fs')
  const dir=x=>fs.readdirSync(x).filter(t=>t.match(/^[a-z]/i))
  const x=SRC+'/app'

  Object.assign(Router, {
    config: null,
    module: {},
  })

  for(let name of dir(x)) {
    if(name[0]==='.') continue
    if(name[0].toUpperCase()!==name[0]) {
      if(name.indexOf('config.')===0) {
        cmds.push(`import * as config from '@/app/config'`)
        cmds.push(`Router.config=config`)
      }else{
        cmds.push(`import * as Mod_${name} from '@/app/${name}'`)
        cmds.push(`Router.module.${name}=Mod_${name}`)
      }
      continue
    }

    const page=name
    const href=`/p/${page}`
    Router[page]={href, page}
    const ref=`Page_${page}_ref`
    echo(`import * as ${ref} from '@/app/${page}';\n`)
    paths.push(`  '${href}': [${ref}, '${page}'], `)
    Router_paths_ref[href]=page
  }

  echo(`export const Router=${JSON.stringify(Router)};`)
  echo(`const Router_paths_ref=${JSON.stringify(Router_paths_ref)};`)
  echo(`const paths={${paths.join('\n')}};`)
  echo(cmds.join('\n')+'\n')

  const CustomRouter={...Router}
  delete CustomRouter.config
  delete CustomRouter.module
  echo(`export const CustomRouter=${JSON.stringify(CustomRouter)};`)
  autoTouchByChanges(__filefullname, [SRC+'/app'])
?>;

import {parseUrl} from '@/utils/url'

export function getPageRef() {
  const e=location.pathname
  const path=paths[e]? e: '/p/Index'
  const [ref, page]=paths[path]
  return {path, ref, page}
}

export function isCurrent(link) {
  const a=parseUrl(link), b=parseUrl(location.href)
  if(a.pathname==='/') a.pathname='/p/Index'
  if(b.pathname==='/') b.pathname='/p/Index'
  if(a.pathname!==b.pathname) return false
  for(let x in a.query) {
    if(b.query[x]!==a.query[x]) return false
  }
  return true
}

export function getZIndex(x) {
  return Router.config?.zIndex?.[x.page] || 1
}

export function getIsUnique(x) {
  return Router.config?.isUnique?.[x.page] || false
}
