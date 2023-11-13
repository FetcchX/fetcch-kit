import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

const FetcchModal = ({
  requestId,
  name,
  action,
  secretKey,
}: {
  requestId: string;
  name: string;
  action: string;
  secretKey: string;
}) => {
  const [request, setRequest] = useState<any>();
  const [failed, setFailed] = useState(false);
  const [success, setSuccess] = useState(false);
  const [interval, setIntervals] = useState<any>() 

  useEffect(() => {
    setFailed(false);
    fetch(
      `https://staging-api.fetcch.xyz/v1/transaction-request?id=${requestId}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "secret-key": secretKey,
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        setRequest(res.data);
      })
      .catch(() => {
        setFailed(true);
      });
  }, []);

  const checkSuccess = () => {
    console.log("Called");
    setInterval(() => {
      fetch(
        `https://staging-api.fetcch.xyz/v1/transaction-request?id=${requestId}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            "secret-key": secretKey,
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          if (res.data.executed) {
            if (res.data.actions[0].executionData) {
              setRequest(res.data);
              setSuccess(true);
              clearInterval(interval!)
              return;
            }
          }
        })
        .catch(() => {
          setFailed(true);
        });
    }, 3000);

    setIntervals(interval)
  };

  useEffect(() => {
    if(success) clearInterval(interval)
  }, [success])

  const explorerLinks: { [key: number]: string } = {
    1: "https://etherscan.io/tx",
    2: "https://polygonscan.com/tx",
    3: "https://bscscan.com/tx",
    4: "https://avascan.info/blockchain/c/tx",
    5: "https://optimistic.etherscan.io/tx",
    6: "https://arbiscan.io/tx",
    7: "https://solana.fm/tx",
    8: "https://explorer.aptoslabs.com/txn",
  };

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 backdrop-blur-sm" />
      <Dialog.Content className="ring-primary fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border-2 border-[#B0C8FE] bg-white p-9 shadow-lg ring-[3px] ring-inset duration-200 sm:rounded-lg md:w-full sm:max-w-xl md:max-w-md">
        <div className="w-full h-full">
          {/* header */}
          <div className="flex text-center sm:text-left w-full flex-row items-center justify-between">
            <Dialog.Title className="text-xl md:text-3xl font-bold leading-none tracking-tight">
              {action} with Fetcch
            </Dialog.Title>
            <Dialog.Close className="inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none border border-primary bg-white h-10 w-10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-4 w-4 font-bold text-primary"
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </div>
          <div className="w-full h-full">
            {!request ? (
              <div className="w-full flex items-center justify-center space-x-3 mt-7">
                {failed ? (
                  <div className="w-full h-72 flex justify-center items-center flex-col space-y-3 bg-white rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-24 h-24"
                      fill="red"
                      viewBox="0 -8 528 528"
                    >
                      <title>fail</title>
                      <path d="M264 456Q210 456 164 429 118 402 91 356 64 310 64 256 64 202 91 156 118 110 164 83 210 56 264 56 318 56 364 83 410 110 437 156 464 202 464 256 464 310 437 356 410 402 364 429 318 456 264 456ZM264 288L328 352 360 320 296 256 360 192 328 160 264 224 200 160 168 192 232 256 168 320 200 352 264 288Z" />
                    </svg>
                    <p>Failed</p>
                  </div>
                ) : (
                  <div className="w-full h-72 flex justify-center items-center flex-col space-y-3 bg-white rounded-md">
                    <svg
                      className="animate-spin h-16 w-16 text-black"
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
                        stroke-width="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <p>fetcching request data</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full flex items-center justify-center space-x-3 mt-7">
                <div className="w-full h-72 flex justify-start items-start flex-col space-y-3 bg-white rounded-md">
                  <h1 className="w-full text-md font-bold">Details</h1>
                  <div className="w-full flex justify-center items-start flex-col space-y-3">
                    <p className="w-full whitespace-nowrap flex space-x-3">
                      <p>Label:</p>{" "}
                      <p className="whitespace-nowrap">{request.label}</p>
                    </p>
                    <p className="w-full whitespace-nowrap flex space-x-3">
                      <p>Receiver:</p>{" "}
                      <p className="w-40 truncate whitespace-nowrap">
                        {request.recevier.owner ?? request.recevier.ownerId}
                      </p>
                    </p>
                    <p className="w-full whitespace-nowrap flex space-x-3">
                      <p>Message:</p>{" "}
                      <p className="whitespace-nowrap">{request.message}</p>
                    </p>
                    <p className="w-full whitespace-nowrap flex space-x-3">
                      <p>Requested At:</p>{" "}
                      <p className="whitespace-nowrap">
                        {new Date(request.requestedAt).toLocaleDateString()}
                      </p>
                    </p>
                  </div>
                  <div className="w-full h-full flex justify-center items-center flex-col space-y-3">
                    {success ? (
                      <>
                        <svg
                          className="w-8 h-8"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="green"
                          viewBox="0 0 1024 1024"
                        >
                          <path
                            fill="green"
                            d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336L456.192 600.384z"
                          />
                        </svg>
                        <a
                          target="_blank"
                          href={`${
                            explorerLinks[
                              request.actions[0].executionData.chain
                            ]
                          }/${request.actions[0].executionData.hash}`}
                          className="flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none text-primary shadow-[inset_0px_6px_4px_0px_rgba(255,255,255,0.2)] px-7 py-4 border bg-white border-primary w-full"
                        >
                          Check transaction
                        </a>
                      </>
                    ) : (
                      <>
                        <svg
                          className="animate-spin h-8 w-8 text-black"
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
                            stroke-width="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <p className="text-[10px]">
                          processing request, click on pay and complete the
                          process
                        </p>
                      </>
                    )}
                  </div>
                </div>
                {/* <div className="w-full h-72 bg-white flex justify-center items-center rounded-md"></div> */}
              </div>
            )}

            <div
              onClick={() => checkSuccess()}
              className="flex flex-col md:flex-row space-y-3 md:space-x-3 md:space-y-0"
            >
              <a
                target="_blank"
                href={`https://request.fetcch.xyz/request/${requestId}`}
                className="flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none text-white shadow-[inset_0px_6px_4px_0px_rgba(255,255,255,0.2)] px-7 py-4 border bg-primary border-white w-full"
              >
                <span onClick={() => checkSuccess()}>{action}</span>
              </a>
            </div>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
};

export default FetcchModal;
