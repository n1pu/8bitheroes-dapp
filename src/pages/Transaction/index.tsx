import * as React from "react";
import * as Dapp from "@elrondnetwork/dapp";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";
import PageState from "components/PageState";
import { routeNames } from "routes";
import { get } from "https";
import randomNFT from "./../../assets/img/random.gif";

const Transaction = () => {
  const { search } = useLocation();
  const { apiAddress } = Dapp.useContext();

  const query = new URLSearchParams(search);
  const { status, txHash } = Object.fromEntries(query);

  const [URLs, setURLs] = React.useState<Array<string>>([]);
  const [IDs, setIDs] = React.useState<Array<number>>([]);

  const getInfo = async () => {
    await fetch(
      "https://api.elrond.com/transactions/0a4d822a7b05a7fcb1f193a9c4d671d517e79a3d8b6db9e9c9cda9e7695e5e19",
    )
      .then((res) => res.json())
      .then((responseText) => {
        for (const i in responseText["operations"]) {
          const nonce =
            responseText["operations"][i]["identifier"].split("-")[2];
          const newID = parseInt(nonce, 16);
          setIDs((prevState) => [...prevState, newID]);
          setURLs((prevState) => [
            ...prevState,
            `https://gateway.pinata.cloud/ipfs/QmWV5jdF4jWMArAXzUk2b6wDXSmrcKx1DohbeHNLKCDxLz/${newID}.png`,
          ]);
        }
      });
  };

  React.useEffect(() => {
    getInfo();
  }, []);

  const handleChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const card = target.parentElement!.parentElement!;
    card.classList.add("active");
    const index = parseInt(card.parentElement?.dataset.index as string);
    card.parentElement!.lastElementChild!.innerHTML = `8-Bit Heroes #${IDs[index]}`;
  };

  return (
    <div className="transactions-container">
      <div className="nfts-container">
        {URLs.map((url, index) => {
          return (
            <div
              className="nft-container"
              data-index={index}
              key={index}
              onClick={handleChange}
            >
              <div className="nft-card">
                <div className="card-front">
                  <img src={randomNFT} className="front" />
                </div>
                <div className="card-back">
                  <img src={url} className="back" />
                </div>
              </div>
              <p>???</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  // return status === "success" ? (
  //   <PageState
  //     svgComponent={
  //       <FontAwesomeIcon icon={faCheck} className="text-success fa-3x" />
  //     }
  //     className="dapp-icon icon-medium"
  //     title="Transaction submitted successfully"
  //     description={
  //       <>
  //         {/* <h2> {!revealed ? "Click to reveal your NFT!" : `NFT #${nftID}`}</h2>

  //         <div className="card-container">
  //           <div className="card-img">
  //             <div className="card-front">
  //               <img src={nftURL} />
  //               {nftURLs !== "" && <h3></h3>}
  //             </div>
  //             <div className="card-back">
  //               <img
  //                 src="https://art.pixilart.com/b09197d64f69d63.png"
  //                 style={{ width: "314px" }}
  //               />
  //             </div>
  //           </div>
  //         </div> */}
  //       </>
  //     }
  //   />
  // ) : (
  //   <PageState
  //     svgComponent={
  //       <FontAwesomeIcon icon={faTimes} className="text-danger fa-3x" />
  //     }
  //     className="dapp-icon icon-medium"
  //     title="Error sending transaction"
  //     description={
  //       <>
  //         <p>Try again</p>
  //         <a href={routeNames.dashboard} className="btn btn-primary mt-3">
  //           Back to dashboard
  //         </a>
  //       </>
  //     }
  //   />
  // );
};

export default Transaction;
