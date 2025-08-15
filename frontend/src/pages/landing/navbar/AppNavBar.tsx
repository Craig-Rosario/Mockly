"use client";
import {
  Navbar, NavBody, NavItems, MobileNav, NavbarLogo, NavbarButton,
  MobileNavHeader, MobileNavToggle, MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState, useCallback, useEffect } from "react";

export function AppNavbar() {
  const navItems = [
    { name: "Features", link: "#features" },
    { name: "Pricing",  link: "#pricing"  },
    { name: "FAQ",      link: "#faq"      },   
    { name: "Contact",  link: "#contact"  },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleHashNav = useCallback((hash: string) => {
    const id = hash.replace(/^#/, "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    }
  }, []);

  useEffect(() => {
  if (window.location.hash) {
    history.replaceState(null, "", "/");
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}, []);

  return (
    <div className="relative w-full">
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <div
            onClickCapture={(e) => {
              const target = e.target as HTMLElement;
              const a = target.closest("a") as HTMLAnchorElement | null;
              if (a?.hash) {
                e.preventDefault();
                handleHashNav(a.hash);
              }
            }}
          >
            <NavItems items={navItems} />
          </div>
          <div className="flex items-center gap-4">
            <NavbarButton variant="secondary">Login</NavbarButton>
          </div>
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((s) => !s)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                className="relative text-neutral-600 dark:text-neutral-300"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false); 
                  handleHashNav(item.link);
                }}
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Login
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
