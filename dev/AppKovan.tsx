import React, { useState } from 'react'
import ReactDom from 'react-dom'

import Box from '@material-ui/core/Box'
import { styled } from '@material-ui/core/styles'

import { Connection, Loader, ModalPositionManager, PositionManager } from '../src'
import { EMPProvider, ReactWeb3Provider, UMARegistryProvider, useEMPAt } from '../src'
import { ConfigProvider } from '../src/hooks/useConfig'

const App: React.FC = () => {
    // external
    const { instance: empInstance } = useEMPAt("0xf57fa3ddb811e8f9ba2dd5295dc12c6db53447a0")

    // internal
    const [openModal, setOpenModal] = useState(false)
    const [openCreator, setOpenCreator] = useState(false)

    const handleManageClick = () => {
        setOpenModal(true)
    }

    const handleClose = () => {
        setOpenModal(false)
    }

    const handleCreateClick = () => {
        setOpenCreator(true)
    }

    const handleCloseCreator = () => {
        setOpenCreator(false)
    }

    if (!empInstance) {
        return <Loader />
    }

    return (
        <React.Fragment>
            <UMARegistryProvider>
                <EMPProvider empInstance={empInstance}>
                    <h1>Demo Kovan App</h1>
                    <h3>Position Manager</h3>
                    <StyledBoxContent border="1px solid black">
                        <PositionManager />
                    </StyledBoxContent>

                    <hr />

                    <h3>Modal Position Manager</h3>
                    <button
                        style={{ background: '#ff4a4a', color: 'white', padding: '1em 3em', border: 'none', borderRadius: '4px' }}
                        onClick={handleManageClick}
                    >
                        Open
                    </button>

                    <ModalPositionManager open={openModal} handleClose={handleClose} />

                    <h3>Position Creator</h3>
                    <button
                        style={{ background: '#ff4a4a', color: 'white', padding: '1em 3em', border: 'none', borderRadius: '4px' }}
                        onClick={handleCreateClick}>
                        Open
                    </button>
                    <ModalPositionManager onlyCreate={true} open={openCreator} handleClose={handleCloseCreator} />
                </EMPProvider>
            </UMARegistryProvider>
        </React.Fragment>
    )
}

const AppWrapped: React.FC = () => {
    const { provider, connect } = Connection.useContainer()
    return (
        <ReactWeb3Provider injectedProvider={provider}>
            <button onClick={connect}>
                Connect
            </button>
            <App />
        </ReactWeb3Provider>
    )
}

const StyledBoxContent = styled(Box)({
    backgroundColor: 'white', // TODO
    display: 'flex',
    height: 320,
    padding: 0,
    paddingTop: 0,
    alignItems: 'center',
})

ReactDom.render(<ConfigProvider
    onboardAPIKey={process.env.NEXT_PUBLIC_ONBOARD_API_KEY as string}
    infuraId={process.env.NEXT_PUBLIC_INFURA_ID as string}
    umaAPIBaseUrl={process.env.UMA_API_BASE_URL as string}
    supportedNetworkIds={JSON.parse(process.env.SUPPORTED_NETWORK_IDS)}>
    <Connection.Provider>
        <AppWrapped />
    </Connection.Provider>
</ConfigProvider>, document.getElementById('root'))
