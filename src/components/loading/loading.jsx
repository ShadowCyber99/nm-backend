// import {Backdrop, CircularProgress} from '@material-ui/core'
import {Backdrop, CircularProgress} from '@mui/material'
import React from 'react'

const Loading = () => {
	return (
		<Backdrop open={true}>
			<CircularProgress color='inherit' />
		</Backdrop>
	)
}

export default Loading
