import React from 'react';
import { Box, CircularProgress } from '@material-ui/core';

export const Loader: React.FC = () => {
    return (
        <Box py={2} textAlign="center">
            <CircularProgress color="secondary" />
        </Box>
    )
}