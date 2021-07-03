import React from 'react'
import { PropsWithChildren } from 'react'

export const MaxLink: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    return <div style={{ textDecoration: 'underline' }}>{children}</div>
}

export const MinLink: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    return <div style={{ textDecoration: 'underline' }}>{children}</div>
}
