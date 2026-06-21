"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

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
          ? "bg-white/80 backdrop-blur-lg shadow-sm border-b border-line/20 py-3"
          : "bg-white/40 backdrop-blur-md border-b border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-8 h-8 select-none pointer-events-none">
                <Image
                  src="/images/logo.png"
                  alt="Prime UAT Logo"
                  width={32}
                  height={32}
                  priority
                  className="object-contain"
                />
              </div>
              <Image
                src="/images/prime.png"
                alt="Prime UAT"
                width={1174}
                height={217}
                priority
                quality={100}
                className="h-8 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#courses"
              className="text-muted hover:text-ink font-medium text-sm transition-colors duration-200 relative group py-2"
            >
              Courses
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="#mock-tests"
              className="text-muted hover:text-ink font-medium text-sm transition-colors duration-200 relative group py-2"
            >
              Mock Tests
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="#pricing"
              className="text-muted hover:text-ink font-medium text-sm transition-colors duration-200 relative group py-2"
            >
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand transition-all duration-300 group-hover:w-full" />
            </Link>
            <Link
              href="#about"
              className="text-muted hover:text-ink font-medium text-sm transition-colors duration-200 relative group py-2"
            >
              About Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand transition-all duration-300 group-hover:w-full" />
            </Link>
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-5">
            <Link
              href="/login"
              className="text-muted hover:text-ink font-medium text-sm transition-colors duration-200 px-3 py-2"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="relative inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-brand rounded-xl hover:bg-brand-600 transition-all duration-200 shadow-md shadow-brand/10 hover:shadow-lg hover:shadow-brand/20 active:scale-[0.98] group overflow-hidden"
            >
              {/* Button Shimmer Effect */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:animate-shimmer" />
              Sign up
            </Link>
          </div>

          {/* Mobile hamburger menu button */}
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
                // Close Icon (X)
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
                // Hamburger Icon
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

      {/* Mobile Menu Panel */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[300px] border-b border-line/20 bg-white" : "max-h-0"
        }`}
        id="mobile-menu"
      >
        <div className="px-4 pt-2 pb-6 space-y-2">
          <Link
            href="#courses"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-muted hover:text-brand hover:bg-brand-50 transition-all"
          >
            Courses
          </Link>
          <Link
            href="#mock-tests"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-muted hover:text-brand hover:bg-brand-50 transition-all"
          >
            Mock Tests
          </Link>
          <Link
            href="#pricing"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-muted hover:text-brand hover:bg-brand-50 transition-all"
          >
            Pricing
          </Link>
          <Link
            href="#about"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-muted hover:text-brand hover:bg-brand-50 transition-all"
          >
            About Us
          </Link>
          <div className="pt-4 flex flex-col gap-3 px-3">
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="text-center py-2.5 rounded-lg text-base font-medium text-muted hover:text-ink border border-line hover:bg-surface transition-all"
            >
              Log in
            </Link>
            <Link
              href="/signup"
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
