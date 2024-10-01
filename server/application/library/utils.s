<?js
class Lib_utils{
	static promisify(fn) {
    return function(...argv) {
      return new Promise(resolve=>{
        let ret=null
        argv[argv.length]=(e, ...data)=>resolve([e, ret, data])
        ret=new.target? new fn(...argv): fn.apply(this, argv)
      })
    }
  }

	static withResolvers() {
		let resolve, reject
		const promise=new Promise((_resolve, _reject)=>{
			resolve=_resolve
			reject=_reject
		})
		return {promise, resolve, reject}
	}

}
