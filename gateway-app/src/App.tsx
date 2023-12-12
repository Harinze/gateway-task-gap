import React from "react";
import  { Route, Routes } from "react-router-dom";
import AddDevice from "./pages/AddDevice"; 
import Home from "./pages/LandingPage";
import Register from "./pages/Register";
//import UserPage from "./pages/SingleLandingPage";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/adddevice" element={<AddDevice />}></Route>
      <Route path="/register" element={<Register />}></Route>
      {/* <Route path="/user/:serialNumber" element={<UserPage />} /> */}
    </Routes>
  );
};

export default App;
