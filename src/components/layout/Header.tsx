import Link from "next/link";
import HeaderNavigation from "./HeaderNavigation";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <HeaderNavigation>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo.webp"
            alt="AS"
            className="w-10 h-10 rounded-full"
          />
        </Link>
      </HeaderNavigation>
    </header>
  );
};

export default Header;
