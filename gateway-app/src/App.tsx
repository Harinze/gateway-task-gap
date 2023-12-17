import React from "react";
import  { Route, Routes } from "react-router-dom";
import AddDevice from "./pages/AddDevice"; 
import Home from "./pages/LandingPage";
import Register from "./pages/Register";


const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/adddevice" element={<AddDevice />}></Route>
      <Route path="/register" element={<Register />}></Route>
    </Routes>
  );
};

export default App;

