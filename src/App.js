import React, { useState, useEffect } from "react";
import Web3 from "web3";
import PropertyManagementComponent from "./Pages/Properties/PropertyManagementComponent";
import Navigation from "./Components/NavigationBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import HomePage from "./Pages/Home/HomePage";
import UserProfile from "./Pages/Profile/ProfileComponent";
import AddProperty from "./Pages/Properties/AddProperty";
import ViewProperty from "./Pages/Properties/ViewProperty";
function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/propertyManage"
            element={<PropertyManagementComponent />}
          />
          <Route path="/addProperty" element={<AddProperty />} />
          <Route path="/viewProperty/:id" element={<ViewProperty />} />
          <Route path="/myBookings" element={<UserProfile />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
