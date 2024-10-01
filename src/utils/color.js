function str2ratio(x) {
  let p=0, n=[341, 170], i=1
  for(let c of x) {
    let o=c.charCodeAt(i)
    p=p+(o | n[i++%2])
    p=p & 0xff
  }
  return p/0xff
}
function ratio2color(r) {
  const colors=[
    '#ff0000',
    '#f300ff',
    '#0000ff',
    '#006fff',
    '#00f7ff',
    '#00ff00',
    '#ff9400',
    '#ff0000',
  ]
  const v=r*(colors.length-2), b=Math.floor(v)
  return mixcolor(colors[b], v-Math.floor(v), colors[b+1])
}
function mixcolor(c1, r, c2) {
  const r1=r, r2=1-r
  let p='#'
  for(let i=0; i<3; i++) {
    const b1=parseInt(c1.substr(1+i*2, 2), 16),
          e1=parseInt(c2.substr(1+i*2, 2), 16)
    const a=Math.round(b1*r1+e1*r2).toString(16)
    p+=a.length<2? '0'+a: a
  }
  return p
}
export function str2color(x) {
  return mixcolor(ratio2color(str2ratio(x)), .3, '#ffffff')
}
