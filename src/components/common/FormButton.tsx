import React from 'react'
import Button, { ButtonProps } from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { styled } from '@material-ui/core/styles'

export interface FormButtonProps extends ButtonProps {
    isSubmitting: boolean
    submittingText: string
    text: string
}

export const FormButton: React.FC<FormButtonProps> = ({ isSubmitting, onClick, disabled, submittingText, text, ...props }) => {
    return (
        <ColorButton color="primary" disableElevation fullWidth variant="contained" onClick={onClick} disabled={disabled} {...props}>
            {isSubmitting ? submittingText : text}
            {isSubmitting && <CircularProgress style={{ marginLeft: '0.5em', color: 'white' }} size={24} />}
        </ColorButton>
    )
}

const ColorButton = styled(Button)({
    textTransform: 'capitalize',
    color: '#fff',
    backgroundColor: '#ff4a4a',
    '&:hover': {
        opacity: 0.9,
        backgroundColor: '#ff4a4a',
    },
    '&.MuiButtonBase-root:disabled': {
        color: 'rgba(0, 0, 0, 0.26)',
    },
})
