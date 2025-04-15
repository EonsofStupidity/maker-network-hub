
import { Outlet } from "react-router-dom";
import MainNav from "@/app/components/MainNav";

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};
