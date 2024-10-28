const {
  APP_PATH,
  getRuntimeArgv,
  getPostCssPlugins,
  requireNodeModuleFile,
}=require(__dirname+'/lib')
const craco=require('@craco/craco')
const webpack=require('webpack')
const Webpackbar=require('webpackbar')
const chalk=require('chalk')
const fs=require('fs')
const MiniCssExtractPlugin=require('mini-css-extract-plugin')
const fs_extra=require('fs-extra')
const {NPM_ARGV}=getRuntimeArgv()
const path=require('path')
const createWebpackBase=requireNodeModuleFile('react-scripts/config/webpack.config')
function createWebpackConfig({isServer=false, env='development'}) {
  const IS_DEV=env==='development'
  const webpackConfig={
    target: !isServer? 'web': 'node',
    name: !isServer? 'client': 'server',
    mode: IS_DEV? 'development': 'production',
    optimization: {
      runtimeChunk: false,
      splitChunks: false,
    },
  }
  const base=createWebpackBase(env)
  base.plugins.push(
    new Webpackbar({
      name: webpackConfig.name,
      basic: false,
    }),
  )

  craco.removePlugins(base, x=>[
    'HtmlWebpackPlugin',
    'ManifestPlugin',
    'ESLintWebpackPlugin',
  ].includes(x.constructor.name))

  craco.removeLoaders(base, craco.loaderByName('style-loader'))
  craco.getLoaders(base, craco.loaderByName('postcss-loader')).matches.map(e=>{
    const _fn=e.loader.options.plugins
    e.loader.options.plugins=_=>[..._fn(), ...getPostCssPlugins().plugins]
  })
  craco.getLoaders(base, craco.loaderByName('babel-loader')).matches.map(e=>{
    e.loader.options.plugins=[]
  })
  base.module.rules.push({
    test: /\.([tj]sx?|scss)/,
    exclude: /node_modules/,
    options: {
      file: __dirname+'/sptc.inject.js',
    },
    loader: 'sptc/dist/webpack.loader.js',
  })

  if(isServer) {
    craco.removePlugins(base, x=>[
      'MiniCssExtractPlugin',
      'InterpolateHtmlPlugin',
      'InlineChunkHtmlPlugin',
      'WebpackManifestPlugin',
      'ReactRefreshPlugin',
      'ForkTsCheckerWebpackPlugin',
      'WatchMissingNodeModulesPlugin',
      'ModuleNotFoundPlugin',
      'ModuleScopePlugin',
    ].includes(x.constructor.name))

    craco.removeLoaders(base, craco.loaderByName('mini-css-extract-plugin'))
    base.module.rules[1].oneOf.map(x=>{
      if(x.test && ('.css'.match(x.test) || '.scss'.match(x.test))) {
        x.use='null-loader'
      }
    })

    base.resolve.plugins=[]
    base.output.filename='server/index.js'
    base.entry=APP_PATH+'/src/bootstrap.jsx';
    base.output.chunkFilename='server/chunk.[contenthash].js';
    base.output.libraryTarget='commonjs2';
  }else{
    if(IS_DEV) {
      craco.removePlugins(base, craco.pluginByName('HotModuleReplacementPlugin'))
      base.plugins.push(
        new webpack.DefinePlugin('process', '{}'),
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
          filename: 'static/css/[name].css',
          chunkFilename: 'static/css/[name].chunk.css',
        }),
      )
      base.module.rules[1].oneOf.map(rule=>{
        if(!rule.use) return;
        if(rule.use.find(x=>x.loader.indexOf('postcss-loader'))) {
          rule.use.unshift({
            loader: MiniCssExtractPlugin.loader,
            options: {},
          })
        }
      })
    }
    const newEntry=APP_PATH+'/src/bootstrap.jsx'
    if(typeof base.entry==='string') {
      base.entry=newEntry
    }else if(Array.isArray(base.entry)) {
      base.entry[base.entry.length-1]=newEntry
    }
  }

  if(!IS_DEV) {
    webpackConfig.externals=isServer? {
      react: 'react',
      'react-dom': 'react-dom',
    }: {
      react: 'React',
      'react-dom': 'ReactDOM',
    }
  }

  base.resolve.alias=Object.assign(base.resolve.alias, {
     '@': APP_PATH+'/src',
     src: APP_PATH+'/src',
  })
  base.output.chunkCallbackName='webpackChunk_'+Date.now().toString(36)
  base.output.jsonpFunction='webpackJsonp_'+Date.now().toString(36)
  if(!IS_DEV) {
    base.output.path=APP_PATH+'/dist'
    base.output.publicPath='/assets/app/'
  }
  const conf=Object.assign(Object.assign({}, base), webpackConfig)
  conf.devtool='none'
  return conf
}

function webpackDev(port=3000) {
  fs_extra.emptyDirSync(APP_PATH+'/dist')
  const createDevBase=requireNodeModuleFile('react-scripts/config/webpackDevServer.config')
  const devConfig=Object.assign({}, createDevBase(), {
    writeToDisk: fn=>fn.indexOf('server')>0,
    injectClient: true,
    disableHostCheck: true,
    index: '',
    proxy: {
      context: ['/'],
      target: 'http://127.0.0.1:9090/',
    },
  })

  const clientConfig=createWebpackConfig({isServer: false})
  const serverConfig=createWebpackConfig({isServer: true})
  const config=[clientConfig, serverConfig]
  const multiCompiler=webpack(config)

  multiCompiler.hooks.done.tap('done', stats=>{
    const [clientStats, serverStats] = stats.toJson({
      all: false,
      warnings: true,
      errors: true,
      modules: false,
      entrypoints: true,
      publicPath: false,
    }).children
    const errors=[...clientStats.errors, ...serverStats.errors]
    const warnings=[...clientStats.warnings, ...serverStats.warnings]

    if(errors.length) {
      console.log(chalk.red('Failed to compile.\n'))
      console.log(errors[0])
    }else if(warnings.length) {
      console.log(chalk.yellow('Compiled with warnings.\n'))
      console.log(warnings.join('\n\n'))
    }else{
      const hot=clientStats.entrypoints.main.assets.find(x=>x.endsWith('.hot-update.js'))
      const ret={
        srv: '/server/index.js',
        js: '/static/js/bundle.js',
        css: '/static/css/main.css',
        hot: hot? '/'+hot: '',
      }
      fs.writeFileSync(APP_PATH+'/dist/assets.json', JSON.stringify(ret))

      console.log(chalk.green('Compiled successfully!'))
    }
  })

  const WebpackDevServer=require('webpack-dev-server')
  const devServer=new WebpackDevServer(multiCompiler, devConfig)
  devServer.listen(port, '0.0.0.0', e=>{
    if(e) throw e
    devServer.middleware.waitUntilValid(_=>{
      console.log(`> Ready on http://0.0.0.0:${port}`)
    })
  })
}

function webpackBuild() {
  fs_extra.emptyDirSync(APP_PATH+'/dist')
  const clientConfig=createWebpackConfig({isServer: false, env: 'production'})
  const serverConfig=createWebpackConfig({isServer: true, env: 'production'})
  const config=[clientConfig, serverConfig]
  const multiCompiler=webpack(config)

  multiCompiler.run((err, multiStats)=>{
    if(err) {
      throw err
    }
    if(multiStats.hasErrors()) {
      const message = multiStats.toJson({ all: false, errors: true }).errors.join('\n')
      throw new Error(message)
    }

    const [clientStats]=multiStats.toJson({
      all: false,
      warnings: false,
      errors: false,
      modules: false,
      entrypoints: true,
      publicPath: false,
    }).children
    const _f=re=>clientStats.entrypoints.main.assets.find(x=>x.match(re))
    const ret={
      srv: 'server/index.js',
      js: _f(/main\..+?\.js$/),
      css: _f(/main\..+?\.css$/),
    }
    fs.writeFileSync(APP_PATH+'/dist/assets.json', JSON.stringify(ret))
    const srv_dist=path.resolve(APP_PATH+'/server/public/app')
    fs_extra.emptyDirSync(srv_dist)
    fs_extra.moveSync(APP_PATH+'/dist', srv_dist, {overwrite: true})

    console.info(multiStats.toString({ colors: true }))
  })

}

module.exports={
  webpackDev,
  webpackBuild,
}
