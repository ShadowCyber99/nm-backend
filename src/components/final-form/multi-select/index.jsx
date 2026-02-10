import React from 'react'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import {makeStyles} from '@mui/styles'
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
}
const useStyles = makeStyles((theme) => ({
	withoutLabel: {
		marginTop: theme.spacing(2),
		backgroundColor: '#FAFAFA',
		width: '100%',
	},
	textField: {},
	input: {
		fontSize: 14,
	},
	helperText: {
		margin: `${theme.spacing(0.2, 0, 0, 0)} !important`,
		backgroundColor: '#F3F3F3',
	},
}))
const MultiSelect = ({
	input: {value, name, onChange, ...restInput},
	required,
	meta,
	...rest
}) => {
	const classes = useStyles()
	return (
		<FormControl
			className={classes.withoutLabel}
			fullWidth
			required={required}
			// error={strictValidString(errorText)}
		>
			<InputLabel htmlFor='select-multiple-chip'>
				{rest.labelname}
			</InputLabel>
			<Select
				MenuProps={MenuProps}
				multiple
				displayEmpty
				{...rest}
				name={name}
				inputProps={restInput}
				error={meta.error && meta.touched}
				onChange={onChange}
				value={[...value]}
			/>
		</FormControl>
	)
}
export default MultiSelect
