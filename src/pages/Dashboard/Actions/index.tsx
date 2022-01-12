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

  const getInfo = async () => {
    const contract = new SmartContract({
      address: new Address(contractAddress),
    });
    const response = await contract.runQuery(dapp.proxy, {
      func: new ContractFunction("getMintedSupply"),
    });
    const buf = Buffer.from(response.returnData[0], "base64");
    setNftsMinted(500 - parseInt(buf.toString("hex"), 16));
  };

  React.useEffect(() => {
    getInfo();
  }, []);

  const send =
    (transaction: RawTransactionType) => async (e: React.MouseEvent) => {
      const co = "8BITHEROES-bcbc9f";

      const x = await fetch(
        `https://devnet-api.elrond.com/accounts/${address}/nfts/count?collections=${co}`,
      ).then((res) => res.text());

      const data = await fetch(
        `https://devnet-api.elrond.com/accounts/${address}/nfts?size=${x}&collections=${co}`,
      ).then((res) => res.json());
      let count = 0;
      for (const nft in data) {
        if (data[nft]["nonce"] >= 1001 && data[nft]["nonce"] <= 1500) {
          count++;
        }
      }
      console.log(count);

      if (count >= 20) alert("You have already minted 20 NFTs from this batch");
      else if (count + quantity > 20)
        alert(
          `You cannot mint ${quantity} NFTs as you have already minted ${count} NFTs from this batch`,
        );
      else {
        transaction.value = `${quantity * 0.4}`;
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
    value: "0.4",
    gasLimit: 600000000,
  };

  const handleChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    const self = event.target as HTMLElement;
    if (self.id === "minus") {
      if (quantity > 1) setQuantity(quantity - 1);
    } else if (self.id === "plus") {
      if (quantity < 8) setQuantity(quantity + 1);
    }
  };

  return (
    <div className="text-white">
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
      <div>{nftsMinted}/500 NFTs minted</div>
    </div>
  );
};

export default Actions;
