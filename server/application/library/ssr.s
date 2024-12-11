<?js

class Lib_ssr{

	static __IS_SSR__=false;

	static __IS_SSR_PAYLOAD_TIMEOUT__=false;

  getDistDir() {
    return __IS_DEV__? __DEV_WEB_DIR__+'/dist': __WEB__+'/app'
  }

  timelimitQuery(query) {
    return Promise.race([query, Utils.sleep(__SSR_PAYLOAD_TIMEOUT__, query)])
  }

  buildContext() {
    const exports={}
    const self={module: {exports}, require}

    const NOOP=function() {}
    Object.assign(self, {
      window: self,
      addEventListener: NOOP,
      WebSocket: NOOP,
      setInterval: NOOP,
      setTimeout: NOOP,
      self,
    })

    const location={}
    const navigator={}
    const document={}
    Object.assign(self, {location, navigator, document})
    const href='http://'+$_RAW_REQUEST['headers']['host']+$_RAW_REQUEST['url']
    location.href=href
    ; [, location.pathname, location.search]=href.match(/:\/\/[^/]+([^\?]+)(.*)/)
    navigator.userAgent=$_RAW_REQUEST['headers']['user-agent'] || 'unknown'
    document.cookie=$_RAW_REQUEST['headers'].cookie || ''

    self.ServerFetch=async (url, option={})=>{
      const {resolve, execute}=include(__ROUTER__)
      try{
        await this.timelimitQuery(execute(resolve(url), {ssrData: option.body || {}}))
        const [code]=getResponseStatus()
        return {
          statusCode: code,
          responseHeaders: getResponseHeaders(),
          responseJSON: JSON.parse(readEchoed()),
        }
      }catch(e) {}
    }

    if(__IS_DEV__) self.console=console

    return self
  }

  getVm() {
    const filename=this.getDistDir()+'/server/index.js'
    const contentWrapper=__IS_DEV__?
      source=>source.replace(/(throw new Error.+?HMR.+?Hot Module Replacement is disabled.)/, 'return;$1'):
      undefined
    return Utils.compileFile(filename, {
      contentWrapper,
      compileFunc: source=>{
        const vm=require('vm')
        const path=require('path')
        const fn=path.resolve(filename)
        return new vm.Script(source, fn)
      },
      customCache: (Application.ssrVmCache=Application.ssrVmCache || {}),
    })
  }

	getAssets() {
		const path=require('path')
		const assets_fn=path.resolve(this.getDistDir()+'/assets.json')
		const assets=require(assets_fn)
		if(__IS_DEV__) delete require.cache[assets_fn]
		return assets
	}

  async render() {
	  Lib_ssr.__IS_SSR__=true

    const req=new Lib_request
    const {
      eruda: USE_ERUDA,
      force_csr: IS_FORCE_CSR,
    }=req.getQuery()

    const srvModule=this.getVm().runInNewContext(this.buildContext())

    let payload=null
		try{
			if(!IS_FORCE_CSR) payload=await this.timelimitQuery(srvModule.init())
		}catch(e) {
			Lib_ssr.__IS_SSR_PAYLOAD_TIMEOUT__=true
		}

    const ssrHTML=srvModule.renderToString()

    const assets=this.getAssets()

		const arg={
			USE_ERUDA,
			ssrHTML,
			payload,
			extraDevHTMLCss: '',
			extraDevHTMLJs: '',
			js: [],
			css: [],
		}
		const {css, js}=arg

    js.push('/assets/externals/js/highlight.min.js')
    css.push('/assets/externals/css/github-dark.min.css')

		if(__IS_DEV__) {
			arg.extraDevHTMLCss=`
			  <style type=text/css>iframe{display:none!important;}</style>
			  <link href="${assets.css}" rel="stylesheet" type="text/css" />
			`
			arg.extraDevHTMLJs=`
				<script src="${assets.js}"></script>
				<script src="${assets.hot || ''}"></script>
			`
		}else{
			js.push(
        '/assets/externals/js/react.production.min.js',
        '/assets/externals/js/react-dom.production.min.js',
				`/assets/app/${assets.js}`,
      )
			css.push(`/assets/app/${assets.css}`)
		}

    include(__dirname+'/ssr.html.s', arg)

  }
}
