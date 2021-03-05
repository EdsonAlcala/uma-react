import { Box } from '@material-ui/core'
import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import ReactDom from 'react-dom'

import { deployEMP, getUMAInterfaces, Loader, ModalPositionManager, PositionManager, toWeiSafe, useStyles } from '..'
import { ReactWeb3Provider } from '..'
import { buildFakeEMP } from '../fakers'
import { EMPProvider, useEMPAt, useWeb3Provider } from '..'
import { getAllEMPData, UMARegistryProvider } from '..'

// call yarn start:dev
const App: React.FC = () => {
    // external
    const { provider } = useWeb3Provider()

    const [empAddress, setEMPAddress] = useState<string | undefined>(undefined)
    const { instance: empInstance } = useEMPAt(empAddress)

    // internal
    const [openModal, setOpenModal] = useState(false)
    const [positionHasBeenCreated, setPositionHasBeenCreated] = useState(false)
    const handleManageClick = () => {
        setOpenModal(true)
    }

    const handleClose = () => {
        setOpenModal(false)
    }

    const classes = useStyles()

    useEffect(() => {
        if (provider) {
            const deployLocalEMP = async () => {
                const fakeEMP = buildFakeEMP()
                const network = await provider.getNetwork()
                const signer = provider.getSigner()
                const result = await deployEMP(fakeEMP, network, signer)
                const { expiringMultiPartyAddress } = result
                setEMPAddress(expiringMultiPartyAddress)
            }

            deployLocalEMP()
                .then(() => console.log("Local EMP deployed successfully"))
                .catch((error) => console.log("Error deploying local EMP", error))
        }
    }, [provider])

    useEffect(() => {
        if (empInstance) {
            const setupGCR = async () => {
                try {
                    // setup allowance first
                    const empData = await getAllEMPData(empInstance)
                    const allInterfaces = getUMAInterfaces()
                    const signer = provider.getSigner()
                    const collateralInstance = new ethers.Contract(empData.collateralCurrency, allInterfaces.get('ERC20'), signer)
                    const receipt = await collateralInstance.approve(empAddress, ethers.constants.MaxUint256)
                    await receipt.wait()

                    // create position
                    const collateralDecimals = await collateralInstance.decimals();
                    const collateralWei = toWeiSafe("125", collateralDecimals); // collateral = input by user
                    const tokensWei = toWeiSafe("100", collateralDecimals); // tokens = input by user
                    const tx = await empInstance.create([collateralWei], [tokensWei]);
                    await tx.wait();
                    setPositionHasBeenCreated(true)
                } catch (error) {
                    console.error(error);
                }
            }

            setupGCR()
                .then(() => console.log("Created initial position and setup GCR"))
                .catch((error) => console.log("Error creating initial position", error))
        }
    }, [empInstance])

    if (!empInstance && !positionHasBeenCreated) {
        return (<Loader />)
    }
    return (
        <React.Fragment>
            <UMARegistryProvider>
                <EMPProvider empInstance={empInstance}>
                    <h1>Demo App</h1>

                    <h3>Position Manager</h3>
                    <Box className={classes.root} border="1px solid black">
                        <PositionManager empAddress="" />
                    </Box>

                    <hr />

                    <h3>Modal Position Manager</h3>
                    <button style={{ background: "#ff4a4a", color: "white", padding: "1em 3em", border: "none", borderRadius: "4px" }} onClick={handleManageClick}>Open</button>
                    <ModalPositionManager open={openModal} handleClose={handleClose} />
                </EMPProvider>
            </UMARegistryProvider>
        </React.Fragment>
    )
}


const AppWrapped: React.FC = () => {
    const [provider, setProvider] = useState<ethers.providers.JsonRpcProvider | undefined>(undefined)

    useEffect(() => {
        const URL = "http://localhost:8549";
        const newProvider = new ethers.providers.JsonRpcProvider(URL);
        setProvider(newProvider);
        console.log("Provider set");
    }, []);

    if (!provider) {
        return (<Loader />)
    }

    return (
        <ReactWeb3Provider injectedProvider={provider}>
            <App />
        </ReactWeb3Provider>
    )
}

ReactDom.render(
    <AppWrapped />,
    document.getElementById('root'),
)
