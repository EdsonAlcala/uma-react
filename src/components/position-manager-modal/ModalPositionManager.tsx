import React from 'react';

export interface ModalPositionManagerProps {
    open: boolean
    handleClose: () => void
}

export const ModalPositionManager: React.FC<ModalPositionManagerProps> = () => {
    return (
        <h3>Modal Position Manager</h3>
    );
}

