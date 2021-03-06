import React from 'react'
import styled from 'styled-components'
import { Box, Typography } from '@material-ui/core'
import CallMadeIcon from '@material-ui/icons/CallMade'

import { useEtherscan } from '../../hooks'

export interface TransactionResultAreaProps {
    hash: string | undefined
    error: Error | undefined
}

export const TransactionResultArea: React.FC<TransactionResultAreaProps> = ({ hash, error }) => {
    const { getEtherscanUrl } = useEtherscan()

    return (
        <Box color="black" display="flex" flexDirection="column" fontSize="0.9em">
            {hash && (
                <React.Fragment>
                    <Typography>
                        <label style={{ color: 'rgb(98, 93, 247)', fontSize: '0.9em' }}>Transaction successful</label>
                    </Typography>
                    <Box>
                        <Link href={getEtherscanUrl(hash)} target="_blank" rel="noopener noreferrer">
                            <span style={{ fontSize: '1em', display: 'inline-flex', alignItems: 'center', marginTop: '0.5em' }}>
                                View on Etherscan <CallMadeIcon style={{ fontSize: '1.3em' }} />
                            </span>
                        </Link>
                    </Box>
                </React.Fragment>
            )}

            {error && (
                <React.Fragment>
                    <Typography>
                        <label style={{ color: 'red' }}>{error.message}</label>
                    </Typography>
                </React.Fragment>
            )}
        </Box>
    )
}

const Link = styled.a`
    text-decoration: none;
    color: black;
`
