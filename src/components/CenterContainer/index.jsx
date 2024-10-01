import React from 'react'
import './index.scss'
export default function(props) {
	const {children, maxWidth}=props
	return <div className='__view_scope' style={{
		width: maxWidth,
	}}>{children}</div>
}
