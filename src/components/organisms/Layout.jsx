import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";

const Layout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;