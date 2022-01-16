import * as React from "react";
import * as Dapp from "@elrondnetwork/dapp";
import {
  Address,
  AddressValue,
  ContractFunction,
  SmartContract,
  Query,
} from "@elrondnetwork/erdjs";
import { contractAddress } from "config";
import { RawTransactionType } from "helpers/types";
import useNewTransaction from "pages/Transaction/useNewTransaction";
import { routeNames } from "routes";

const Actions = () => {
  const sendTransaction = Dapp.useSendTransaction();
  const { address, dapp } = Dapp.useContext();
  const newTransaction = useNewTransaction();

  const [nftsMinted, setNftsMinted] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);

  const contract = new SmartContract({
    address: new Address(contractAddress),
  });

  const co = "8BITHEROES-d3022d";
  const DROP_SIZE = 500;
  const DROP_PRICE = 0.4;
  const DROP_MAX = 20;

  const RANGE_MIN = 1001;
  const RANGE_MAX = 1500;

  const getInfo = async () => {
    const url = `https://api.elrond.com/accounts/${contractAddress}/nfts/count`;
    const data = await fetch(url).then((res) => res.json());
    isNaN(data) ? setNftsMinted(DROP_SIZE) : setNftsMinted(DROP_SIZE - data);
  };

  React.useEffect(() => {
    getInfo();
  }, []);

  const send =
    (transaction: RawTransactionType) => async (e: React.MouseEvent) => {
      const x = await fetch(
        `https://api.elrond.com/accounts/${address}/nfts/count?collections=${co}`,
      ).then((res) => res.text());

      const data = await fetch(
        `https://api.elrond.com/accounts/${address}/nfts?size=${x}&collections=${co}`,
      ).then((res) => res.json());
      let count = 0;
      for (const nft in data) {
        if (
          data[nft]["nonce"] >= RANGE_MIN &&
          data[nft]["nonce"] <= RANGE_MAX
        ) {
          count++;
        }
      }
      if (count >= DROP_MAX)
        alert(`You have already minted ${DROP_MAX} NFTs from this drop.`);
      else if (count + quantity > DROP_MAX) {
        alert(`You can only mint ${DROP_MAX - count} NFTs from this drop.`);
        setQuantity(DROP_MAX - count);
      } else {
        transaction.value = `${quantity * DROP_PRICE}`;
        transaction.data = `mint@0${quantity}`;
        e.preventDefault();
        sendTransaction({
          transaction: newTransaction(transaction),
          callbackRoute: routeNames.transaction,
        });
      }
    };

  const mintTransaction: RawTransactionType = {
    receiver: contractAddress,
    data: "mint",
    value: `${DROP_PRICE}`,
    gasLimit: 600000000,
  };

  const handleChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    getInfo();
    const self = event.target as HTMLElement;
    if (self.id === "minus") {
      if (quantity > 1) setQuantity(quantity - 1);
    } else if (self.id === "plus") {
      if (quantity < 8) {
        if (quantity < DROP_SIZE - nftsMinted) setQuantity(quantity + 1);
      }
    }
  };

  return (
    <div className="text-white">
      {nftsMinted !== DROP_SIZE && (
        <>
          <div className="topInfo">
            <div>Price: {DROP_PRICE} EGLD</div>
            <div>Max {DROP_MAX} NFTs per wallet</div>
          </div>
          <div className="input-qty">
            <button id="minus" onClick={handleChange}>
              -
            </button>
            <span>{quantity}</span>
            <button id="plus" onClick={handleChange}>
              +
            </button>
          </div>
          <button className="mint-btn" onClick={send(mintTransaction)}>
            Mint
          </button>
        </>
      )}
      {nftsMinted === DROP_SIZE && (
        <button className="mint-btn" disabled>
          SOLD OUT
        </button>
      )}

      <div>
        {nftsMinted}/{DROP_SIZE} NFTs minted
      </div>
    </div>
  );
};

export default Actions;
