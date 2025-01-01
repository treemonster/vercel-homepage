<?js setResponseHeaders({'content-type': 'text/html; charset=utf8'}) ?>
<!doctype html>
<html>
<head>
  <link rel="icon" href="data:,">
  <base target='_blank' />
  <?js if(USE_ERUDA) { ?>
    <script src='<?js echo(__CDN_FILE_MAP__['eruda.js']) ?>'></script>
    <script>eruda.init();</script>
  <?js } ?>
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no,maximum-scale=1.0,viewport-fit=cover" />
  <meta charset=utf8 />
  <?js for(let css_link of css) { ?>
    <link href='<?js echo(css_link) ?>' crossorigin='anonymous' rel='stylesheet' type='text/css' />
  <?js } ?>
  <script>
  for(const css of document.querySelectorAll('link[rel=stylesheet]')) {
    if(css.sheet.cssRules.length>0) continue;
    document.write(`<style type='text/css'>*{display: none!important;}</style>`);
    setTimeout(_=>location.reload(), 1e3);
    break
  }
  </script>
  <script type="module">
  import('#').catch(_=>{
    window.__SUPPORT_ESMODULE__=true
  })
  </script>
</head>
<body>
  <?js echo(extraDevHTMLCss) ?>
  <div class='app'>$${{ssrHTML}}</div>
  <script type='text/javascript'>
    window.__CDN_FILE_MAP__=<?js echo(JSON.stringify(__CDN_FILE_MAP__)) ?>;
    window.__ssr_payload__=<?js echo(JSON.stringify(payload)) ?>;
  </script>
  <?js for(let js_link of js) { ?>
    <script type='text/javascript' src='<?js echo(js_link) ?>'></script>
  <?js } ?>
  <?js echo(extraDevHTMLJs) ?>
  <script>
  window.KAZE2024_JS_READY || setTimeout(_=>location.reload(), 1e3)
  </script>
</body>
</html>

<?js
echo(readEchoed().replace(/\s*[\n\r]+\s*|^\s*/g, '').replace('$${{ssrHTML}}', ssrHTML))
