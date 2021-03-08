import React from 'react'
import { Dialog, DialogContent, styled } from '@material-ui/core'

import { PositionManager } from '../position-manager/Main'

export interface ModalPositionManagerProps {
    open: boolean
    handleClose: () => void
}

const StyledDialogContent = styled(DialogContent)({
    backgroundColor: 'white', // TODO 
    display: 'flex',
    height: 320,
    padding: 0,
    paddingTop: 0,
    alignItems: 'center',
})

export const ModalPositionManager: React.FC<ModalPositionManagerProps> = ({ open, handleClose }) => {
    return (
        <Dialog fullWidth={true} maxWidth="md" open={open} onClose={handleClose} aria-labelledby="max-width-dialog-title">
            <StyledDialogContent style={{ paddingTop: '0' }}>
                <PositionManager />
            </StyledDialogContent>
        </Dialog>
    )
}
