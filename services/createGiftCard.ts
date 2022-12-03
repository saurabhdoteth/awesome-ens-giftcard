import { ethers, Signer } from "ethers";

import ERC721 from "../abis/ERC721.json";
import { calculateGasMargin } from "../utils/calculateGasMargin";
import ipfsClient from "../utils/ipfsClient";

export async function createGiftCard({
  ensName,
  message,
  account,
  signer,
}: {
  ensName: string;
  message?: string;
  account: string;
  signer: Signer;
}) {
  console.log({ ensName });

  // create burner wallet
  const { address: recipient, privateKey } = ethers.Wallet.createRandom();
  console.log(recipient, privateKey);

  // fetch token id
  const BigNumber = ethers.BigNumber;
  const utils = ethers.utils;
  const labelHash = utils.keccak256(
    utils.toUtf8Bytes(ensName.substring(0, ensName.length - 4))
  );
  const tokenId = BigNumber.from(labelHash).toString();
  console.log({ tokenId });

  // save metadata to ipfs
  const metadata = {
    ensName,
    message,
    recipient,
    sender: account,
    tokenId,
  };

  const ipfsHash = await ipfsClient.add(JSON.stringify(metadata));
  console.log({ ipfsHash });

  // tranfer ENS+$ETH to this address
  const contract = new ethers.Contract(
    "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85",
    ERC721,
    signer
  );

  const estimatedGas = await contract.estimateGas.safeTransferFrom(
    account,
    recipient,
    tokenId
  );

  const data = await contract.safeTransferFrom(account, recipient, tokenId, {
    gasLimit: calculateGasMargin(estimatedGas),
  });
  await signer.sendTransaction({
    to: recipient,
    value: ethers.utils.parseEther("0.01"),
  });
  console.log(data);

  return {
    recipient,
    privateKey,
    tokenId,
    ipfsHash: ipfsHash.path,
    txHash: data.hash,
  };
}
