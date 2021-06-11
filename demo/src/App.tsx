import React from "react"

import { Connection } from 'uma-react'

export const App = () => {
    return (
        <React.Fragment>
            <Connection.Provider>
                <Component />
            </Connection.Provider>
        </React.Fragment>

    )
}

const Component = () => {
    const { connect } = Connection.useContainer()
    return (
        <React.Fragment>
            <h1>Hi</h1>
            <button onClick={() => connect()}>Connect</button>
        </React.Fragment>)
}