import React from 'react'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'

export const Loader: React.FC = () => {
    return (
        <Box py={2} textAlign="center">
            <CircularProgress color="secondary" />
        </Box>
    )
}
