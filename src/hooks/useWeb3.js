import { useState, useEffect } from "react";
import Web3 from "web3";
import env from "../env";
import PropertyManagementABI from "./PropertyManagement.json";
import PropertyReservationABI from "./PropertyReservation.json";

export const useWeb3 = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contracts, setContracts] = useState({});

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        const accounts = await web3Instance.eth.getAccounts();
        setAccounts(accounts);

        const propertyManagementContract = new web3Instance.eth.Contract(
          PropertyManagementABI,
          env.contractAddress
        );
        const propertyReservationContract = new web3Instance.eth.Contract(
          PropertyReservationABI,
          env.reservationAddress
        );
        
        setContracts({
          propertyManagementContract,
          propertyReservationContract,
        });
      }
    };

    initWeb3();
  }, [window.ethereum]);

  return { web3, accounts, contracts };
};
