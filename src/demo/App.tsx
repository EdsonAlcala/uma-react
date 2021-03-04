import React, { useState } from 'react'
import ReactDom from 'react-dom'

import { ModalPositionManager, PositionManager } from '../components'

// call yarn start:demo
const App: React.FC = () => {
    const [openModal, setOpenModal] = useState(false)

    const handleManageClick = () => {
        setOpenModal(true)
    }

    const handleClose = () => {
        setOpenModal(false)
    }

    return (
        <React.Fragment>
            <h1>Demo App</h1>

            <h3>Position Manager</h3>
            <PositionManager empAddress="" />

            <hr />

            <h3>Modal Position Manager</h3>
            <button style={{ background: "#ff4a4a", color: "white", padding: "1em 3em", border: "none", borderRadius: "4px" }} onClick={handleManageClick}>Open</button>
            <ModalPositionManager open={openModal} handleClose={handleClose} />
        </React.Fragment>
    )
}

ReactDom.render(
    <App />,
    document.getElementById('root'),
)
