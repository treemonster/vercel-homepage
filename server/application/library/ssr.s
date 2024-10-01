<?js

class Lib_ssr{

	isQueryFlag(v) {
		return $_RAW_REQUEST['url'].indexOf(v)>-1
	}

	timelimitQuery(query, timeout=1e3) {
		return Promise.race([query, Utils.sleep(timeout, query)])
	}

	buildContext() {
		const exports={}
    const self={module: {exports}, require}
    const NOOP=function() {}
    Object.assign(self, {
      self,
      location: {
        href: 'http://'+$_RAW_REQUEST['headers']['host']+$_RAW_REQUEST['url']
      },
      addEventListener: NOOP,
      WebSocket: NOOP,
      setInterval: NOOP,
      setTimeout: NOOP,
    })
    self.ServerFetch=async (url, option={})=>{
      const {resolve, execute}=include(__ROUTER__)
      try{
				await this.timelimitQuery(execute(resolve(url), {ssrData: option.body || {}}))
        const [code, ]=getResponseStatus()
        return {
          statusCode: code,
          responseHeaders: getResponseHeaders(),
          responseJSON: JSON.parse(readEchoed()),
        }
      }catch(e) {}
    }
    if(__IS_DEV__) self.console=console
    const appCtx={
      url: self.location.href,
      headers: $_RAW_REQUEST['headers'],
    }
    return [self, appCtx]
	}

	async render() {
		const arg={
			USE_EDURA: this.isQueryFlag('edura=1'),
      css: [],
      syncJs: [],
			props: {},
      ssrHTML: null,
      asyncJs: [],
			extHeaderStr: '',
		}
		const isForceCsr=this.isQueryFlag('force_csr=1')

	  arg.syncJs.push('/assets/externals/js/highlight.min.js')
	  arg.css.push('/assets/externals/css/highlight.css')

		const $_distDir=__IS_DEV__? __DEV_WEB_DIR__+'/dist': __WEB__+'/app'

		const vm1=((filename, contentWrapper)=>Utils.compileFile(filename, {
      contentWrapper,
      compileFunc: source=>{
        const vm=require('vm')
        const path=require('path')
        const fn=path.resolve(filename)
        return new vm.Script(source, fn)
      },
      customCache: (Application.ssrVmCache=Application.ssrVmCache || {}),
    }))(
			$_distDir+'/server/index.js',
			__IS_DEV__?
			  source=>source.replace(/(throw new Error.+?HMR.+?Hot Module Replacement is disabled.)/, 'return;$1'):
				undefined,
    )

		const [ctx, appCtx]=this.buildContext()
		const e=vm1.runInNewContext(ctx)
		e.prepareCtx && e.prepareCtx(appCtx)
		const payload=isForceCsr? null: await this.timelimitQuery(e.fetchPayload()).catch(_=>{
			define('__SSR_TIMEOUT__', true)
			return null
		})
		arg.ssrHTML=e.renderToString(payload)
		arg.props.__ssr_payload__=JSON.stringify(payload)

		const path=require('path')
		const assets_fn=path.resolve($_distDir+'/assets.json')
		const assets=require(assets_fn)
		if(__IS_DEV__) delete require.cache[assets_fn]

		arg.css.push((__IS_DEV__? '': '/assets/app/')+assets.css)
		if(__IS_DEV__ && assets.hot) arg.asyncJs.push(assets.hot)

		if(__IS_DEV__) {
			arg.extHeaderStr='<style type=text/css>iframe{display:none!important;}</style>'
		}else{
			Object.assign(arg.props, {
				React: 'window.React',
				ReactDom: 'window.ReactDOM',
			})
			arg.syncJs.push(
				'/assets/externals/js/react.production.min.js',
				'/assets/externals/js/react-dom.production.min.js',
			)
		}
		arg[__IS_DEV__? 'syncJs': 'asyncJs'].push((__IS_DEV__? '': '/assets/app/')+assets.js)

    include(__dirname+'/ssr.html.s', arg)

	}
}
