<?js setResponseHeaders({'content-type': 'text/html; charset=utf8'}) ?>
<!doctype html>
<html>
<head>
  <?js echo(extHeaderStr) ?>
  <link rel="icon" href="data:,">
  <base target='_blank' />
  <?js if(USE_EDURA) { ?>
    <script src='/assets/externals/js/eruda.min.js'></script>
    <script>eruda.init();</script>
  <?js } ?>
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no,maximum-scale=1.0,viewport-fit=cover" />
  <meta charset=utf8 />
  <?js for(const x of css) { ?>
  <link href='<?js echo(x) ?>' rel='stylesheet' type='text/css' />
  <?js } ?>
  <script type="module">window.__SUPPORT_ESMODULE__=typeof import('#')==='object'</script>
</head>
<body>
  <div class='app'>$${{ssrHTML}}</div>
  <?js for(const x of venderJs) { ?>
    <script type='text/javascript' src='<?js echo(x) ?>'></script>
  <?js } ?>
  <script type='text/javascript'>
    <?js for(let key in props) {
      echo(`window.${key}=${props[key]};`)
    } ?>
  </script>
  <?js for(const {src, isAsync} of assetJs) { ?>
    <script type='text/javascript' <?js echo(isAsync? 'defer async': '') ?> src='<?js echo(src) ?>'></script>
  <?js } ?>
</body>
</html>

<?js
echo(readEchoed().replace(/\s*\n\s+|^\s*/g, '').replace('$${{ssrHTML}}', ssrHTML))
