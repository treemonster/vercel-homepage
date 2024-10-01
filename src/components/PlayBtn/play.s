<!doctype html>
<html>
<head>
  <meta charset='utf8' />
</head>
<script type="importmap">
  {
    "imports": {
      "sass": "https://esm.sh/sass@1.69.5",
      "babel": "https://esm.sh/@babel/standalone@7.25.8"
    }
  }
</script>
<body>
<script type="module">
if(location.href.indexOf('blob:')===0) {
  URL.revokeObjectURL(location.href)
}

import Babel from 'babel'
import * as Sass from 'sass'

const es_imports={
  "react": "https://esm.sh/react@16.10.1",
  "react-dom": "https://esm.sh/react-dom@16.10.1",
}
const emptyImportLink=URL.createObjectURL(new Blob(['export default {}'], {type: 'text/javascript'}))

<?js if(__USE_AS_TPL__) { ?>
const sources=##SOURCE##
<?js }else{ ?>

const sources=[
    {
        "type": "scss",
        "value": ".block{\n  width: 100%;\n  height: 100px;\n  background: #fbb;\n  opacity: .8;\n  margin: 30px 0;\n}",
        "filename": "index.scss"
    },
    {
        "type": "react",
        "value": "import 'intersection-observer'\nimport './index.scss'\nimport React from 'react'\n\nexport default function(props) {\n  const {\n    onVisible,\n    className,\n    children,\n  }=props\n\n  const wrapperRef=React.useRef(null)\n  React.useEffect(_=>{\n    const observer=new IntersectionObserver((entries, observer)=>{\n      if(!entries[0].isIntersecting) return;\n      onVisible?.()\n      observer.disconnect()\n    })\n    observer.observe(wrapperRef.current)\n    return _=>observer.disconnect()\n  }, [])\n\n  return <div className={className} ref={wrapperRef}>{children}</div>\n}",
        "filename": "Expose.jsx"
    },
    {
        "type": "react",
        "value": "import React from 'react'\nimport ReactDOM from 'react-dom'\nimport Expose from './Expose.jsx'\n\nfunction App(props) {\n  let divs=[]\n  for(let i=0; i<100; i++) {\n    divs.push(<Expose key={i} onVisible={_=>{\n      console.log(`div ${i} is visible!`)\n    }}>\n      <div className='block'>div ${i}</div>\n    </Expose>)\n  }\n  return divs\n}\n\nconst app=document.body.appendChild(document.createElement('div'))\nReactDOM.render(<App />, app)",
        "filename": "App.jsx",
        main: true
    }
]

<?js } ?>

sources.map(s=>{
  if(['scss', 'css'].includes(s.type)) {
    s.value=`
    const css=document.createElement('style')
    css.innerHTML=\`${Sass.compileString(s.value).css.replace(/\`/g, '\\\`')}\`
    css.type='text/css'
    document.body.appendChild(css)
    `
  }else if(['react', 'js'].includes(s.type)) {
    s.value=Babel.transform(s.value, {
      presets: ['react'],
      plugins: [{
        visitor: {
          // https://babeljs.io/docs/babel-types#importdeclaration
          ImportDeclaration(specifiers, source) {
            const i=specifiers.node.source
            const k=i.value.replace(/^\.\//, '')
            i.value=es_imports[k] || emptyImportLink
          },
        }
      }],
    }).code
  }
  es_imports[s.filename]=URL.createObjectURL(new Blob([s.value], {type: 'text/javascript'}))
  if(!s.main) return;
  const t=document.createElement('script')
  t.innerHTML=s.value
  Object.assign(t, {type: 'module'})
  document.querySelector('head').appendChild(t)
});

</script>
</body>
</html>
