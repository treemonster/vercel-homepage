import React from 'react'
export default function(props) {
  const {watches, children}=props
  if(!Array.isArray(watches)) throw new Error('`watches` is invalid')
  return React.useMemo(_=>children, watches)
}
