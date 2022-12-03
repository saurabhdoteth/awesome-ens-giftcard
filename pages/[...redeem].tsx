import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useWaitForTransaction } from "wagmi";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

import { Navbar } from "../components/Navbar";

import ERC721 from "../abis/ERC721.json";
import { calculateGasMargin } from "../utils/calculateGasMargin";

export default function Redeem() {
  const router = useRouter();
  const query = router.query;

  const [loading, setLoading] = useState(false);
  const [giftCardMetadata, setGiftCardMetadata] = useState<any>();
  const [NFTMetadata, setNFTMetadata] = useState<any>();
  const [destAddress, setDestAddress] = useState<string>("");
  const [txHash, setTxHash] = useState("");

  const { data: success, isLoading } = useWaitForTransaction({ hash: txHash });

  useEffect(() => {
    const gitCard = localStorage.getItem("giftCard");

    if (!gitCard && query.privateKey) {
      localStorage.setItem("giftCard", JSON.stringify(query));
    }

    if (query.ipfsHash) {
      fetch(`https://ipfs.io/ipfs/${query.ipfsHash}`)
        .then((response) => response.json())
        .then((response) => {
          setGiftCardMetadata(response);
          if (response.tokenId) {
            fetch(
              `https://metadata.ens.domains/goerli/0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85/${response.tokenId}`
            )
              .then((response) => response.json())
              .then((response) => setNFTMetadata(response));
          }
        });
    }
  }, [query]);

  async function redeem() {
    setLoading(true);
    let giftCard = localStorage.getItem("giftCard");

    if (giftCard) {
      const card = JSON.parse(giftCard);
      const privateKey = card.privateKey;

      if (privateKey) {
        const provider = new ethers.providers.JsonRpcProvider(
          "https://goerli.infura.io/v3/f5ad9726095f4ba394734a533760316c"
        );

        const signer = new ethers.Wallet(privateKey, provider);

        const contract = new ethers.Contract(
          "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85",
          ERC721,
          signer
        );

        const estimatedGas = await contract.estimateGas.safeTransferFrom(
          signer.address,
          destAddress,
          giftCardMetadata.tokenId
        );

        const data = await contract.safeTransferFrom(
          signer.address,
          destAddress,
          giftCardMetadata.tokenId,
          {
            gasLimit: calculateGasMargin(estimatedGas),
          }
        );
        setTxHash(data.hash);
        data.wait(1).then(() => {
          localStorage.removeItem("giftCard");
          setLoading(false);
        });
        setLoading(false);
      }
    }
  }

  return (
    <div className="min-h-screen bg-white-100">
      <Navbar />
      <div className="mt-6 md:mt-8 px-4 w-full md:max-w-xl mx-auto">
        <h1 className="text-2xl font-semibold">Redeem</h1>
        {success ? (
          <div className="p-8 w-full bg-white mt-4 border border-gray-300 flex flex-col items-center justify-center">
            <CheckCircleIcon className="text-gray-900" width={80} height={80} />
            <p className="text-lg font-semibold mt-6 text-center">
              <span className="text-primary">{giftCardMetadata?.ensName}</span>{" "}
              successfully redeemed to{" "}
              {`${destAddress.substring(0, 6)}...${destAddress.substring(
                42 - 6
              )}`}
            </p>
          </div>
        ) : (
          <div className="p-8 w-full bg-white mt-4 border border-gray-300 flex flex-col justify-center">
            {giftCardMetadata ? (
              NFTMetadata ? (
                <img
                  src={NFTMetadata.image || NFTMetadata.image_url}
                  alt={NFTMetadata.name}
                  className="object-cover"
                  width={200}
                />
              ) : undefined
            ) : undefined}

            {giftCardMetadata && giftCardMetadata.sender ? (
              <p className="text-lg mt-8">
                <a
                  href={`https://goerli.etherscan.io/address/${giftCardMetadata.sender}`}
                  target={"_blank"}
                  className="text-primary font-medium hover:underline"
                >{`${giftCardMetadata.sender.substring(0, 6)}`}</a>{" "}
                gifted you{" "}
                <a
                  href={`https://goerli.etherscan.io/enslookup-search?search=${giftCardMetadata.ensName}`}
                  target={"_blank"}
                  className="text-primary font-medium hover:underline"
                >{`${giftCardMetadata.ensName}`}</a>
              </p>
            ) : undefined}

            {NFTMetadata && NFTMetadata.name ? (
              <div className="mt-4">
                <span className="font-medium text-gray-400 uppercase text-sm">
                  Name:
                </span>
                <p className="text-lg text-primary">{NFTMetadata.name}</p>
              </div>
            ) : undefined}

            {giftCardMetadata && giftCardMetadata.message ? (
              <div className="mt-4">
                <span className="font-medium text-gray-400 uppercase text-sm">
                  Message:
                </span>
                <p className="text-lg">{giftCardMetadata.message}</p>
              </div>
            ) : undefined}

            <div className="flex p-2 rounded-md border border-gray-200 mt-4">
              <input
                type="text"
                placeholder="Enter ethereum address"
                className="appearance-none focus:outline-none text-sm p-1 w-full flex-1"
                onChange={(e) => setDestAddress(e.target.value)}
              />
              <button
                className={`appearance-none rounded  px-4 py-2 text-sm flex items-center space-x-2
                   ${
                     isLoading || loading
                       ? "cursor-not-allowed bg-gray-200 text-gray-500"
                       : "bg-primary text-white"
                   }
                  `}
                onClick={() => redeem()}
              >
                {isLoading || loading ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-black/25"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth={4}
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : undefined}
                Redeem
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
