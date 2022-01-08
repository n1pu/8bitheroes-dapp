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

  const getInfo = async () => {
    const contract = new SmartContract({
      address: new Address(contractAddress),
    });
    const response = await contract.runQuery(dapp.proxy, {
      func: new ContractFunction("getAvailableNFTs"),
    });
    const buf = Buffer.from(response.returnData[0], "base64");
    setNftsMinted(parseInt(buf.toString("hex"), 16) - 500);
  };

  React.useEffect(() => {
    getInfo();
  }, []);

  const send =
    (transaction: RawTransactionType) => async (e: React.MouseEvent) => {
      const co = "8BITHEROES-d3022d";

      const data = await fetch(
        `https://api.elrond.com/accounts/erd1s4gl6amyvv5sg8sr2gwu00rklft5y7c2s37js57ynsdu0wgnnxdq2aerw5/nfts?size=25&collections=${co}`,
        // `https://api.elrond.com/accounts/${address}/nfts?size=25&collections=${co}`,
      ).then((res) => res.json());

      console.log(data);

      e.preventDefault();
      // sendTransaction({
      //   transaction: newTransaction(transaction),
      //   callbackRoute: routeNames.transaction,
      // });
    };

  const mintTransaction: RawTransactionType = {
    receiver: contractAddress,
    data: "mint",
    value: "0.3",
    gasLimit: 10000000,
  };

  return (
    <div>
      <button className="mint-btn" onClick={send(mintTransaction)}>Mint</button>
      <span>{nftsMinted}/500 NFTs minted</span>
    </div>
  );
};

export default Actions;
