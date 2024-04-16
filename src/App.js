import React, { useState, useEffect } from "react";
import Web3 from "web3";
import PropertyManagementComponent from "./Components/PropertyManagementComponent";
import PropertyReservationComponent from "./Components/PropertyReservationComponent";
import Navigation from "./Components/NavigationBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import HomePage from "./Components/HomePage";
function App() {
  // const [balance, setBalance] = useState(0);

  // useEffect(() => {
  //   if (window.ethereum) {
  //     // Utilizarea MetaMask ca provider
  //     const web3 = new Web3(window.ethereum);
  //     window.ethereum.enable().then(async (accounts) => {
  //       // Utilizarea primului cont disponibil
  //       const address = accounts[0];
  //       const balanceInWei=await web3.eth.getBalance(address);
  //       setBalance(web3.utils.fromWei(balanceInWei, 'ether'));

  //     });
  //   } else {
  //     console.log('MetaMask nu este instalat');
  //   }
  // }, []);
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Navigation />
        <Routes>
        <Route
            path="/"
            element={<HomePage />}
          />
          <Route
            path="/propertyManage"
            element={<PropertyManagementComponent />}
          />
          <Route
            path="/bookProperty"
            element={<PropertyReservationComponent />}
          />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
