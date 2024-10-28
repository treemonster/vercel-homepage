enum {
  T_NULL,
  T_COMMENT,
  T_SELECTOR,
  T_SELECTOR_END,
  T_RULES,
}

function lexer(css) {
  function NULL(parent) {
    return {type: T_NULL, payload: '', children: [], parent}
  }

  let tokens={parent: null, children: []}, c=NULL(tokens), i=0
  tokens.children.push(c)

  function moveNext(newChild=false) {
    c=NULL(newChild? c: c.parent)
    c.parent.children.push(c)
  }
  function skipSpace() {
    for(; [' ', '\r', '\n'].includes(css[i]); i++);
  }
  function addComment() {
    skipSpace()
    if(css.substr(i, 2)!=='//') return;
    c.type=T_COMMENT
    i+=2
    for(; !['\n', '\r'].includes(css[i]); i++) c.payload+=css[i]
    moveNext()
  }
  function addSelector() {
    skipSpace()
    c.type=T_SELECTOR
    for(; css[i]!=='{'; i++) c.payload+=css[i]
    moveNext(true)
    i++
  }
  function addRules() {
    skipSpace()
    c.type=T_RULES
    for(; css[i]!==';'; i++) c.payload+=css[i]
    c.payload+=';'
    moveNext()
    i++
  }
  function closeSelector() {
    i++
    c=c.parent
    moveNext()
  }

  function getNextToken() {
    skipSpace()
    const [z, t]=[
      [css.indexOf('{', i), T_SELECTOR],
      [css.indexOf('//', i), T_COMMENT],
      [css.indexOf(';', i), T_RULES],
      [css.indexOf('}', i), T_SELECTOR_END],
    ].filter(x=>x[0]!==-1).reduce((a, b)=>a[0]<b[0] && a[0]!==-1? a: b, [-1, T_NULL])
    return z===-1? T_NULL: t
  }

  function addNextToken() {
    for(let p; p=getNextToken(); ) {
      if(p===T_SELECTOR) addSelector()
      else if(p===T_COMMENT) addComment()
      else if(p===T_RULES) addRules()
      else if(p===T_SELECTOR_END) closeSelector()
      else if(p===T_NULL) return
    }
    addNextToken()
  }
  addNextToken()
  return tokens
}
function parser(tokens, cssMap=new Map) {
  const {parent, children}=tokens

  function link_parent(c) {
    const parse=s=>s? s.split(',').map(x=>x.trim()).filter(Boolean): []
    const link=(p_arr, c_arr)=>{
      let r=[]
      for(let _p of p_arr) {
        for(let _c of c_arr) {
          r.push(_p+(_c[0]==='&'? _c.substr(1): (' '+_c)))
        }
      }
      return r
    }
    for(let _payload=c.payload;;) {
      if(!c.parent.parent) return _payload
      _payload=link(parse(c.parent.payload), parse(_payload)).join(',')
      c=c.parent
    }
  }
  for(let c of children) {
    if([T_COMMENT, T_NULL, T_RULES].includes(c.type)) continue
    if(c.type===T_SELECTOR) {
      const cssRules=[]
      const selector=link_parent(c)
      for(let cc of c.children) {
        if(cc.type===T_RULES) cssRules.push(cc.payload)
      }
      parser(c, cssMap)
      if(!cssMap.has(selector)) cssMap.set(selector, [])
      cssMap.get(selector).push(...cssRules)
    }
  }
  return cssMap
}
function toString(cssMap) {
  let css=``
  for(const [selector, rules] of cssMap) {
    css+=`${selector}{\n${rules.map(x=>'  '+x).join('\n')}\n}\n`
  }
  return css
}

export default function(css) {
  const token=lexer(css)
  const cssMap=parser(token)
  return toString(cssMap)
}
