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
      const data = await fetch(
        `https://devnet-api.elrond.com/accounts/${address}/nfts?collection=GEESE-1c9621`,
      ).then((res) => res.json());
      console.log(data);
      e.preventDefault();
      // sendTransaction({
      //   transaction: newTransaction(transaction),
      //   callbackRoute: routeNames.transaction,
      // });
    };

  const transferTransaction: RawTransactionType = {
    receiver: contractAddress,
    data: "purchase",
    value: "0",
    gasLimit: 10000000,
  };

  return (
    <div>
      <button onClick={send(transferTransaction)}>Transfer</button>
    </div>
  );
};

export default Actions;
