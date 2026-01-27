"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ReactNode } from "react";

const navLinks = [
    { label: "Work", href: "/work" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
];

interface HeaderNavigationProps {
    children: ReactNode;
}

const HeaderNavigation = ({ children }: HeaderNavigationProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const handleNavClick = (href: string) => {
        setIsOpen(false);
        if (href.startsWith("/#")) {
            const id = href.replace("/#", "");
            if (pathname !== "/") {
                // Use browser back if we came from homepage, otherwise navigate
                sessionStorage.setItem("scrollToSection", id);
                if (window.history.state?.idx > 0) {
                    window.history.back();
                } else {
                    router.push("/");
                }
            } else {
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    return (
        <div className="section-container">
            <div className="flex items-center justify-between h-16 lg:h-20">
                {/* Logo injected from server */}
                {children}

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) =>
                        link.href.startsWith("/#") ? (
                            <button
                                key={link.label}
                                onClick={() => handleNavClick(link.href)}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {link.label}
                            </button>
                        ) : (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {link.label}
                            </Link>
                        )
                    )}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="lg:hidden p-2 text-foreground"
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="lg:hidden py-4 border-t border-border">
                    <nav className="flex flex-col gap-4">
                        {navLinks.map((link) =>
                            link.href.startsWith("/#") ? (
                                <button
                                    key={link.label}
                                    onClick={() => handleNavClick(link.href)}
                                    className="text-left text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                                >
                                    {link.label}
                                </button>
                            ) : (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                                >
                                    {link.label}
                                </Link>
                            )
                        )}
                    </nav>
                </div>
            )}
        </div>
    );
};

export default HeaderNavigation;
