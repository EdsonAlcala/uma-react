import React, { useEffect, useState } from 'react'
import ReactDom from 'react-dom'

import Box from '@material-ui/core/Box'
import { styled } from '@material-ui/core/styles'
import { ContractInterface, ethers } from 'ethers'

import { Connection, Loader, ModalPositionManager, PositionManager } from '../src'
import { EMPProvider, getAllEMPData, ReactWeb3Provider, UMARegistryProvider, useEMPAt, useWeb3Provider } from '../src'
import { getUMAInterfaces, toWeiSafe } from '../src'
import { useLocalStorage } from './useLocalStorage'

import { buildFakeEMP } from '../test/fakers'
import { deployEMP } from '../test/test-utilities'
import { ConfigProvider } from '../src/hooks/useConfig'

const App: React.FC = () => {
    // external
    const { connect } = Connection.useContainer()
    const { provider } = useWeb3Provider()

    const [empAddress, setEMPAddress] = useLocalStorage('empAddress', undefined)
    const { instance: empInstance } = useEMPAt(empAddress)

    console.log('EMP Address', empAddress)

    // internal
    const [openModal, setOpenModal] = useState(false)
    const [openCreator, setOpenCreator] = useState(false)
    const [shouldCreatePosition, setShouldCreatePosition] = useState(false)
    const [positionHasBeenCreated, setPositionHasBeenCreated] = useState(false)

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

    useEffect(() => {
        if (provider && !empAddress) {
            const deployLocalEMP = async () => {
                const fakeEMP = buildFakeEMP()
                const network = await provider.getNetwork()
                const signer = provider.getSigner()
                const result = await deployEMP(fakeEMP, network, signer)
                const { expiringMultiPartyAddress } = result
                setEMPAddress(expiringMultiPartyAddress)
                setShouldCreatePosition(true)
            }

            deployLocalEMP()
                .then(() => console.log('Local EMP deployed successfully'))
                .catch((error) => console.log('Error deploying local EMP', error))
        } else {
            console.log('Doing nothing, using cached version')
            setPositionHasBeenCreated(true)
        }
    }, [provider, empAddress])

    useEffect(() => {
        if (empInstance && empAddress && shouldCreatePosition) {
            const setupGCR = async () => {
                try {
                    // setup allowance first
                    const empData = await getAllEMPData(empInstance)
                    const allInterfaces = getUMAInterfaces()
                    const signer = provider.getSigner()
                    const collateralInstance = new ethers.Contract(empData.collateralCurrency, allInterfaces.get('ERC20') as ContractInterface, signer)
                    const receipt = await collateralInstance.approve(empAddress, ethers.constants.MaxUint256)
                    await receipt.wait()

                    const tokenInstance = new ethers.Contract(empData.tokenCurrency, allInterfaces.get('ERC20') as ContractInterface, signer)
                    console.log('Approve correctly')

                    // create position
                    const collateralDecimals = await collateralInstance.decimals()
                    const tokenDecimals = await tokenInstance.decimals()

                    const collateralWei = toWeiSafe('7', collateralDecimals) // collateral = input by user
                    const tokensWei = toWeiSafe('100', tokenDecimals) // tokens = input by user

                    const tx = await empInstance.create([collateralWei], [tokensWei])
                    await tx.wait()
                    setPositionHasBeenCreated(true)
                } catch (error) {
                    console.error(error)
                }
            }
            setupGCR()
                .then(() => console.log('Created initial position and setup GCR'))
                .catch((error) => console.log('Error creating initial position', error))
        } else {
            console.log('Doing nothing, using cached version')
        }
    }, [empInstance, empAddress, shouldCreatePosition])

    if (!empInstance || !positionHasBeenCreated) {
        return <Loader />
    }

    const cleanLocalCache = () => {
        setEMPAddress('')
        alert('Cleaned')
    }

    return (
        <React.Fragment>
            <UMARegistryProvider>
                <EMPProvider empInstance={empInstance}>
                    <h1>Demo App</h1>
                    <Box position="absolute" right="0" top="0">
                        <button onClick={cleanLocalCache}>Clean Local Cache</button>
                        {/* <button onClick={createPositionAndSetupGCR}>Create initial position / Setup GCR</button> */}
                    </Box>
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
                    <button onClick={connect}>
                        Connect
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
    const [provider, setProvider] = useState<ethers.providers.JsonRpcProvider | undefined>(undefined)

    useEffect(() => {
        const URL = 'http://localhost:8549'
        const newProvider = new ethers.providers.JsonRpcProvider(URL)
        setProvider(newProvider)
        console.log('Provider set')
    }, [])

    if (!provider) {
        return <Loader />
    }

    return (
        <Connection.Provider>
            <ReactWeb3Provider injectedProvider={provider}>
                <App />
            </ReactWeb3Provider>
        </Connection.Provider>
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
    <AppWrapped />
</ConfigProvider>, document.getElementById('root'))
