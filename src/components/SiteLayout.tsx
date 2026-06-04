import { Outlet } from "react-router-dom";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const SiteLayout = () => {
  return (
    <div className="min-h-screen marble-bg text-foreground">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default SiteLayout;
