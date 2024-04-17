import React, { useState, useEffect } from "react";
import Web3 from "web3";
import PropertyManagementComponent from "./Components/PropertyManagementComponent";
import PropertyReservationComponent from "./Components/PropertyReservationComponent";
import Navigation from "./Components/NavigationBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import HomePage from "./Components/HomePage";
import UserProfile from "./Components/ProfileComponent";
function App() {

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
          <Route
            path="/profile"
            element={<UserProfile />}
          />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
