import { WagmiConfig, createClient, chain } from "wagmi";
import { ConnectKitProvider, getDefaultClient } from "connectkit";

import "../styles/globals.css";
import type { AppProps } from "next/app";

const alchemyId = process.env.ALCHEMY_ID;

const chains = [chain.goerli];

const client = createClient(
  getDefaultClient({
    appName: "Awesome ENS",
    alchemyId,
    chains,
  })
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider theme="minimal">
        <Component {...pageProps} />
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
