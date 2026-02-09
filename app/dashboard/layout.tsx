import React from "react";
import Sidebar from "../components/ui/Sidebar";
import Topbar from "../components/ui/Topbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen theme-bg-primary dashboard-layout">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-x-hidden overflow-y-auto min-h-screen text-slate-100 ml-0 lg:ml-64 transition-all duration-300">
          <div>
            <Topbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-50">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
