import * as React from "react";
import * as Dapp from "@elrondnetwork/dapp";
import {
  Address,
  AddressValue,
  ContractFunction,
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

  const send =
    (transaction: RawTransactionType) => async (e: React.MouseEvent) => {
      const adr =
        "erd1s4gl6amyvv5sg8sr2gwu00rklft5y7c2s37js57ynsdu0wgnnxdq2aerw5";
      const co = "8BITHEROES-d3022d";
      const encoded = new Buffer(co).toString("hex");

      const data = await fetch(
        `https://api.elrond.com/accounts/${adr}/nfts?size=10&collections=${co}`,
      ).then((res) => res.json());

      let parameters = "";
      let count = 0;
      for (const nft in data) {
        const elt = data[nft];
        if (elt["nonce"] <= 1000 && elt["nonce"] >= 500) {
          count++;
          parameters += `@${encoded}@${elt["identifier"].split("-")[2]}@01`;
        }
      }

      let numberOfNFTs = count.toString(16);
      if (numberOfNFTs.length % 2 === 1) numberOfNFTs = `0${numberOfNFTs}`;

      transaction.data += `@${numberOfNFTs}${parameters}@66756465706F736974`;
      console.log(transaction.data);

      e.preventDefault();
      // sendTransaction({
      //   transaction: newTransaction(transaction),
      //   callbackRoute: routeNames.transaction,
      // });
    };

  const transferTransaction: RawTransactionType = {
    receiver: address,
    data: "MultiESDTNFTTransfer@00000000000000000500AFDAADFE29739A300E83DD01FEFFB6FB22EDA1FA2449",
    value: "0",
    gasLimit: 10000000,
  };

  return (
    <div>
      <button onClick={send(transferTransaction)}>Transfer NFTs</button>
    </div>
  );
};

export default Actions;
