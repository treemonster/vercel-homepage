export function time2str(x) {
  const v=new Date
  v.setTime(x)
  const [y, m, d, ...t]=[
    v.getFullYear(),
    v.getMonth()+1,
    v.getDate(),
    v.getHours(),
    v.getMinutes(),
    // v.getSeconds(),
  ].map(x=>x<10? '0'+x: x)
  return [y, m, d].join('/')+' '+t.join(':')
}
