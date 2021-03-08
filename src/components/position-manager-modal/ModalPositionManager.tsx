import React from 'react'
import { Dialog, DialogContent } from '@material-ui/core'

import { useStyles } from '../common'
import { PositionManager } from '../position-manager/Main'

export interface ModalPositionManagerProps {
    open: boolean
    handleClose: () => void
}

export const ModalPositionManager: React.FC<ModalPositionManagerProps> = ({ open, handleClose }) => {
    const classes = useStyles()

    return (
        <Dialog fullWidth={true} maxWidth="md" open={open} onClose={handleClose} aria-labelledby="max-width-dialog-title">
            <DialogContent className={classes.root} style={{ paddingTop: '0' }}>
                <PositionManager />
            </DialogContent>
        </Dialog>
    )
}
