import React from 'react'

export const FormTitle: React.FC = ({ children }) => {
    return (
        <label style={{ fontFamily: "sans-serif", fontSize: "1.1em" }}>
            {children}
        </label>
    );
}
