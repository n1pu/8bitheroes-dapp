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
    await fetch(`${apiAddress}/transactions/${txHash}`)
      .then((res) => res.json())
      .then((responseText) => {
        for (const i in responseText["operations"]) {
          const nonce =
            responseText["operations"][i]["identifier"].split("-")[2];
          const newID = parseInt(nonce, 16);
          setIDs((prevState) => [...prevState, newID]);
          setURLs((prevState) => [
            ...prevState,
            `https://8-bitheroes.net/wp-content/uploads/2022/02/${newID}.png`,
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

  return status === "success" ? (
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
  ) : (
    <PageState
      svgComponent={
        <FontAwesomeIcon icon={faTimes} className="text-danger fa-3x" />
      }
      className="dapp-icon icon-medium"
      title="Error sending transaction"
      description={
        <>
          <p>Try again</p>
          <a href={routeNames.dashboard} className="btn btn-primary mt-3">
            Back to dashboard
          </a>
        </>
      }
    />
  );
};

export default Transaction;
