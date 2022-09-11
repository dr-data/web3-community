import 'flowbite'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './frontend/App'
import store from "./frontend/store"

import { createClient, WagmiConfig } from 'wagmi'
import { ConnectKitProvider, getDefaultClient } from 'connectkit'
import { chain } from "wagmi"
import { Provider } from "react-redux"


// const chains = [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum]
const chains = [chain.hardhat, chain.polygonMumbai, chain.optimismGoerli]

const client = createClient(
  getDefaultClient({
    appName: "Web3 Community",
    alchemyId: process.env.ALCHEMY_ID,
    chains
  }),
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <WagmiConfig client={client}>
    <ConnectKitProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </ConnectKitProvider>
  </WagmiConfig>
)
