import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'

import { PositionManager } from '../position-manager/Main'
import { createGenerateClassName, StylesProvider } from '@material-ui/core/styles'

export interface ModalPositionManagerProps {
    open: boolean
    handleClose: () => void
    onlyCreate?: boolean
}

const generateClassName = createGenerateClassName({
    productionPrefix: 'cx',
})

export const ModalPositionManager: React.FC<ModalPositionManagerProps> = ({ open, handleClose, onlyCreate }) => {
    return (
        <Dialog fullWidth={true} maxWidth="md" open={open} onClose={handleClose}>
            <StylesProvider generateClassName={generateClassName}>
                <DialogContent style={{ backgroundColor: 'white', display: 'flex', height: 320, padding: 0, paddingTop: '0', alignItems: 'center' }}>
                    <PositionManager onlyCreate={onlyCreate} />
                </DialogContent>
            </StylesProvider>
        </Dialog>
    )
}
