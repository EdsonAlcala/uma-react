import React from 'react'
import { PropsWithChildren } from 'react'

// eslint-disable-next-line
export const MaxLink: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    return <div style={{ textDecoration: 'underline' }}>{children}</div>
}

// eslint-disable-next-line
export const MinLink: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    return <div style={{ textDecoration: 'underline' }}>{children}</div>
}
