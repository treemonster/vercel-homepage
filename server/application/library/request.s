<?js

const {Form}=require('multiparty')
const fs=require('fs')
const qs=require('querystring')

class Lib_request{
	constructor(data) {
		this._data=data
		this._query=null
	}

	readUpstream(upstream, option={}) {
    const {maxlen=__POST_MAXLEN__, timeout=1e3, readAsBinary=false}=option
    const def=Lib_utils.withResolvers()

    upstream.on('error', e=>{
    	upstream.destroy()
      def.reject(e)
    })

    const buf=[]
    let _read_s=0
    const _read_t=setTimeout(_=>{
    	upstream.emit('error', new Error('read input timeout'))
    }, timeout)

    def.promise.finally(_=>{
      clearTimeout(_read_t)
    })

    upstream.on('data', b=>{
    	_read_s+=b.length
    	if(_read_s>maxlen) {
    		upstream.emit('error', new Error('input too long'))
    		return
    	}
    	buf.push(b)
    })

    upstream.on('end', _=>{
      const e=Buffer.concat(buf)
      def.resolve(readAsBinary? e: e.toString('utf8'))
    })

    return def.promise
  }

  async getRequestData(option) {
    if(this._data) return this._data
    if(!$_RAW_REQUEST['_postdata']) {
      $_RAW_REQUEST['_postdata']=this.readUpstream($_RAW_REQUEST, option)
    }
    const data=await $_RAW_REQUEST['_postdata']
		return qs.parse(data)
  }

  async getFormData() {
    const form=new Form
    const _parse=Lib_utils.promisify(form.parse.bind(form))
    const [e, _, data=[]]=await _parse($_RAW_REQUEST)
    if(e) return [e]
    const [fields, files]=data
    defer(_=>{
      for(let k in files) {
        for(let {path} of files[k]) {
          fs.unlink(path, _=>_)
        }
      }
    })
    const up={
      fields: {},
      files: {},
    }
    for(let k in fields) up.fields[k]=fields[k][0]
    for(let k in files) up.files[k]=files[k][0].path
    return [null, up]
  }

	getQuery() {
	  if(!this._query) {
			const url=$_RAW_REQUEST['url']
			const q=url.substr(url.indexOf('?'), url.length)
			if(q.charAt(0)==='?') {
				this._query=qs.parse(q.substr(1))
			}else{
				this._query={}
			}
		}
		return this._query
	}

}
