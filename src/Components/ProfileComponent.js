import React, { useState, useEffect } from "react";
import Web3 from "web3";

function UserProfiles() {
  const [balances, setBalances] = useState([]);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    if (window.ethereum) {
      // Using MetaMask as the provider
      const web3 = new Web3(window.ethereum);
      window.ethereum.request({ method: 'eth_requestAccounts' }).then(async (accounts) => {
        // Using all available accounts
        setAddresses(accounts);
        const balancesPromises = accounts.map(account => 
          web3.eth.getBalance(account).then(balance => web3.utils.fromWei(balance, 'ether'))
        );
        Promise.all(balancesPromises).then(setBalances);
      });
    } else {
      console.log('MetaMask is not installed');
    }
  }, []);

  return (
    <div>
      {addresses.map((address, index) => (
        <div key={address}>
          User with address: {address} has: {balances[index]} ETH
        </div>
      ))}
    </div>
  );
}

export default UserProfiles;
