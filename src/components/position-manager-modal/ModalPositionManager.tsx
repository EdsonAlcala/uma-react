import React from 'react'
import { Dialog, DialogContent } from '@material-ui/core'

import { PositionManager } from '../position-manager/Main'

export interface ModalPositionManagerProps {
    open: boolean
    handleClose: () => void
}

export const ModalPositionManager: React.FC<ModalPositionManagerProps> = ({ open, handleClose }) => {
    return (
        <Dialog fullWidth={true} maxWidth="md" open={open} onClose={handleClose}>
            <DialogContent style={{ backgroundColor: 'white', display: 'flex', height: 320, padding: 0, paddingTop: '0', alignItems: 'center' }}>
                <PositionManager />
            </DialogContent>
        </Dialog>
    )
}
