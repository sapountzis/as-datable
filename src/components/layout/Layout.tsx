import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { CookieProvider } from "@/components/providers/CookieProvider";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <CookieProvider>
      <div className="min-h-screen flex flex-col relative">
        {/* Background layer */}
        <div className="fixed inset-0 bg-background" style={{ zIndex: -2 }} />
        <Header />
        <main className="flex-1 pt-16 lg:pt-20 relative z-10">{children}</main>
        <Footer />
      </div>
    </CookieProvider>
  );
};

export default Layout;
