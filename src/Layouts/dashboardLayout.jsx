import ManagerSidebar from "../components/Sidebar/M-sidebar";
import { useState } from "react";
import { PanelLeftClose, PanelRightClose } from "lucide-react";
import TopDash from "../pages/TopDash";
const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex">
      {sidebarOpen && (
        <div className="motion-preset-slide-right motion-duration-300">
          <ManagerSidebar />
        </div>
      )}
      <button
        className={` fixed top-[77px] -left-1 bg-[#e0cda9] p-2 border border-[#ceb07a] rounded-r-lg transition-all duration-300 z-20 ${sidebarOpen ? "" : "pl-3"}`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? (
          <PanelLeftClose size={25} />
        ) : (
          <PanelRightClose size={25} />
        )}
      </button>
      <div className="flex flex-col w-[100%] h-[100%]">
      <TopDash /> 
      <main className="w-[100%] h-[100%]">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
