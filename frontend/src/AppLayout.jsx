import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import Footer from "./layout/Footer";
import { Outlet } from "react-router-dom";
import "./App.css";

const AppLayout = () => {
  return (
    <>
      <Header />

      <div className="ContentContainer">
        <Sidebar />
        <main className="MainContent">
          <Outlet />
        </main>
      </div>

      <Footer />
    </>
  );
};

export default AppLayout;
