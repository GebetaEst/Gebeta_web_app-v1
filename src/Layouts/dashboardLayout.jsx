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
        className={` absolute top-20 -left-1 bg-cardBackground p-2 border rounded-r-lg border-gray transition-all duration-500`}
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
