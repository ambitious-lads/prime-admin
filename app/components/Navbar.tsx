"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";

const navLinks = [
  { label: "UAT Guide", href: "/uat-guide" },
  { label: "Cutoff Points", href: "/cutoff-points" },
  { label: "Tuition", href: "/tuition" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: site.supportTelegramUrl, external: true },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "border-b border-line/40 bg-white/95 py-3 shadow-sm backdrop-blur-lg"
          : "border-b border-line/40 bg-white/95 py-3 backdrop-blur-lg"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-8 h-8 select-none pointer-events-none">
                <Image
                  src="/images/logo.png"
                  alt="Prime UAT Logo"
                  width={32}
                  height={32}
                  priority
                  className="h-8 w-8 object-contain"
                />
              </div>
            </Link>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="group relative py-2 text-sm font-medium text-muted transition-colors duration-200 hover:text-ink"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-brand transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-5">
            <Link
              href="/login"
              className="text-muted hover:text-ink font-medium text-sm transition-colors duration-200 px-3 py-2"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
            >
              Sign up
            </Link>
          </div>

          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-lg text-muted hover:text-ink hover:bg-brand-50 focus:outline-none transition-all duration-200"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[300px] border-b border-line/20 bg-white" : "max-h-0"
        }`}
        id="mobile-menu"
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-base font-medium text-muted transition-all hover:bg-brand-50 hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-4 flex flex-col gap-3 px-3">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="text-center py-2.5 rounded-lg text-base font-medium text-muted hover:text-ink border border-line hover:bg-surface transition-all"
            >
              Log in
            </Link>
            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="text-center py-2.5 rounded-lg text-base font-semibold text-white bg-brand hover:bg-brand-600 transition-all shadow-md shadow-brand/10"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
