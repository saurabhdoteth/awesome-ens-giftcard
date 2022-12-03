import { useState, Fragment, useMemo } from "react";
import { useAccount, useSigner, useWaitForTransaction } from "wagmi";
import { Dialog, Transition } from "@headlessui/react";
import { QRCodeSVG } from "qrcode.react";
import copy from "copy-to-clipboard";
import QueryString from "query-string";

import { createGiftCard } from "../../services/createGiftCard";

interface ENS {
  name: string;
}

interface GiftCard {
  recipient: string;
  privateKey: string;
  tokenId: string;
  ipfsHash: string;
  txHash: string;
}

export function ENSDetailCard({ ens }: { ens: ENS }) {
  const [loading, setLoading] = useState(false);
  const [giftCard, setGiftCard] = useState<GiftCard | undefined>();
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");

  const { data: success, isLoading } = useWaitForTransaction({
    hash: giftCard?.txHash,
  });

  const { data: signer } = useSigner();
  const { address } = useAccount();

  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function copyText() {
    if (giftCardUrl) {
      copy(giftCardUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }

  const giftCardUrl = useMemo(() => {
    if (
      giftCard &&
      giftCard.privateKey &&
      giftCard.ipfsHash &&
      giftCard.recipient &&
      giftCard.tokenId
    ) {
      const url = QueryString.stringify(giftCard);
      return `${window.origin}/redeem?${url}`;
    }
  }, [giftCard]);

  async function create() {
    setLoading(true);
    openModal();
    if (address && signer) {
      await createGiftCard({
        ensName: ens.name,
        account: address,
        message,
        signer,
      })
        .then((e) => setGiftCard(e))
        .finally(() => {
          setLoading(false);
        });
    }
  }

  return (
    <div className="bg-white p-4 border border-gray-200 flex items-center justify-between min-h-[100px]">
      <h1 className="text-xl font-medium">{ens.name}</h1>
      <button
        type="button"
        className={`inline-flex items-center p-3 font-medium text-sm rounded-md text-white bg-primary transition ease-in-out duration-150 ${
          loading ? "cursor-not-allowed" : ""
        }`}
        onClick={() => openModal()}
        disabled={loading}
      >
        {loading ? (
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
        Create Gift Card
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                {giftCard &&
                giftCard.privateKey &&
                success &&
                success.confirmations ? (
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <div className="flex flex-col items-center justify-center space-y-6">
                      <p className="text-2xl text-primary font-semibold">
                        {ens.name}
                      </p>
                      {/* QR Code */}
                      <div>
                        <QRCodeSVG value={JSON.stringify(giftCard)} />
                      </div>
                      <div className="mt-4 space-y-6">
                        <div className="text-center">
                          <p className="text-gray-500 text-sm">
                            Share this gift card with your friend
                          </p>
                          <p className="text-gray-400 text-xs pt-1">
                            NOTE: This QR code contains sensitive wallet
                            information
                          </p>
                        </div>
                        <button
                          className="text-sm w-full max-w-lg mx-auto text-white bg-primary font-medium px-4 py-2 rounded-md appearance-none focus:outline-none"
                          onClick={() => copyText()}
                        >
                          {copied ? "Copied" : " Copy Gift Card URL"}
                        </button>
                      </div>
                    </div>
                  </Dialog.Panel>
                ) : (
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Write message
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500"></p>
                    </div>

                    <div className="mt-4">
                      <textarea
                        name="message"
                        id="message"
                        rows={4}
                        className="w-full placeholder:text-gray-300 text-sm appearance-none border border-gray-200 rounded-md focus:outline-none p-2"
                        maxLength={200}
                        placeholder="Write message. Max. 200 characters"
                        onChange={(e) => setMessage(e.target.value)}
                      ></textarea>
                      <button
                        type="button"
                        className={`mt-2 inline-flex items-center p-3 font-medium text-sm rounded-md transition ease-in-out duration-150 ${
                          loading || isLoading
                            ? "cursor-not-allowed bg-gray-200 text-gray-500"
                            : "text-primary bg-primary/20"
                        }`}
                        onClick={() => create()}
                        disabled={loading || isLoading}
                      >
                        {loading || isLoading ? (
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
                        Create Gift Card
                      </button>
                    </div>
                  </Dialog.Panel>
                )}
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
