import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { Footer } from "./components/Footer";

const App = () => {
  return (
    <div className="min-h-[100vh] flex flex-col justify-between">
      <Header />
      <Outlet />
      <Footer/>
    </div>
  );
};

export default App;
