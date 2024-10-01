import React from 'react'
import {sleep} from '@/utils/base'

export class ErrorBoundary extends React.Component {
   constructor(props) {
     super(props);
     this.state = {
       hasError: false,
       error: null
     };
   }

   static _errorUI=null;

   static setDefaultErrorUI(errorUI) {
     ErrorBoundary._errorUI=errorUI
   }

   static getDerivedStateFromError(error) {
     return {
       hasError: true,
       error: error
     };
   }

   componentDidCatch(error, errorInfo) {
     console.log('ErrorBoundary=>', {error, errorInfo})
   }

   render() {
     const {children, errorComponent}=this.props
     const { hasError, error } = this.state;
     if (hasError) {
       return errorComponent || ErrorBoundary._errorUI || null
     }
     return children;
   }
 }


export default function(props) {

  const {

    UseComponentSync: sync=false,
    UseComponentGetter: getter,
    UseComponentFailed: Failed=null,
    UseComponentLoading: Loading=null,
    UseComponentDelay: delay=0,
    UseComponentRetry: retry=5,

    ...customProps

  }=props

  const _wrap=T=><ErrorBoundary errorComponent={Failed}>{T}</ErrorBoundary>

  if(sync) {
    try{
      const T=getter().default
      return _wrap(<T {...customProps} />)
    }catch(e) {
      return Failed
    }
  }

  const [disp, set_disp]=React.useState(Loading)
  React.useEffect(_=>{
    ; (async _=>{
      if(delay) {
        await sleep(delay)
      }
      try{
        for(let i=0; i<retry; i++) {
          try{
            const T=(await getter()).default
            set_disp(_wrap(<T {...customProps} />))
            break
          }catch(e) {
            await sleep((1<<i)*1e3)
          }
        }
      }catch(e) {
        console.log('UseComponentError ==>', e)
        set_disp(Failed)
      }
    })()

  }, [props])

  return disp

}
