import Header from "./layout/Header";
import Sidebar from "./layout/Sidebar";
import Footer from "./layout/Footer";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <Header />

      {/* Middle: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="flex-1 w-full">
            <Outlet />
          </div>

          {/* Footer pinned below content */}
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;