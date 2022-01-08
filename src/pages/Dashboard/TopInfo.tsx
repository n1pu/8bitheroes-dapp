import * as React from "react";
import * as Dapp from "@elrondnetwork/dapp";
import { contractAddress } from "config";
import Denominate from "./../../components/Denominate";

const TopInfo = () => {
  const {
    address,
    account: { balance },
  } = Dapp.useContext();

  return (
    <div className="text-white" data-testid="topInfo">
      <div>Price: 0.3 EGLD</div>
      <div>Max 20 NFTs per wallet</div>
    </div>
  );
};

export default TopInfo;
