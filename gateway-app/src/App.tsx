// App.tsx
import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Login"; 
import Home from "./pages/Home";
import Register from "./pages/Register";
const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/login" element={<LoginPage />}></Route>
      <Route path="/register" element={<Register />}></Route>
    </Routes>
  );
};

export default App;