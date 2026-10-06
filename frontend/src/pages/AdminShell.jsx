import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminShell() {
  return (
    <div className="flex min-h-[calc(100vh-56px)] bg-[#f1f5f9]">
      {/* Fixed Admin Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-[240px] p-7 overflow-x-hidden min-h-[calc(100vh-56px)]">
        <Outlet />
      </main>
    </div>
  );
}
