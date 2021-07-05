import React, { PropsWithChildren, useContext, useState, useEffect } from 'react'

interface IConfigProvider {
    onboardAPIKey: string
    infuraId: string
    supportedNetworkIds: number[]
    umaAPIBaseUrl: string
}

const ConfigContext = React.createContext<IConfigProvider>({
    onboardAPIKey: '',
    infuraId: '',
    supportedNetworkIds: [1, 42],
    umaAPIBaseUrl: '',
})

interface Props extends IConfigProvider {}

export const ConfigProvider: React.FC<PropsWithChildren<Props>> = ({ children, ...props }) => {
    const [onboardAPIKey, setOnboardAPIKey] = useState('')
    const [infuraId, setInfuraId] = useState('')
    const [supportedNetworkIds, setSupportedNetworkIds] = useState([])
    const [umaAPIBaseUrl, setUmaAPIBaseUrl] = useState('')

    useEffect(() => {
        setOnboardAPIKey(props.onboardAPIKey)
        setInfuraId(props.infuraId)
        setSupportedNetworkIds(props.supportedNetworkIds)
        setUmaAPIBaseUrl(props.umaAPIBaseUrl)
    }, [])

    return (
        <ConfigContext.Provider
            value={{
                onboardAPIKey,
                infuraId,
                supportedNetworkIds,
                umaAPIBaseUrl,
            }}
        >
            {children}
        </ConfigContext.Provider>
    )
}

export const useConfigProvider = (): IConfigProvider => {
    const context = useContext(ConfigContext)

    if (context === null) {
        throw new Error('useConfigProvider() can only be used inside of <ConfigProvider />, please declare it at a higher level')
    }
    return context
}
