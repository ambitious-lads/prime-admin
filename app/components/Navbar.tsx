"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
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
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-lg transition-shadow ${
        isScrolled || isOpen ? "border-line shadow-sm" : "border-line/50"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center" aria-label="Prime UAT home">
            <Image src="/images/logo.png" alt="Prime UAT" width={36} height={36} priority className="h-9 w-9 object-contain" />
          </Link>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Primary navigation">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="group relative py-2 text-sm font-medium text-muted transition-colors hover:text-ink"
              >
                {item.label}
                <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-brand transition-transform group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login" className="px-3 py-2 text-sm font-semibold text-muted transition-colors hover:text-ink">Log in</Link>
            <Link href="/register" className="inline-flex min-h-10 items-center justify-center rounded-lg bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-600">Sign up</Link>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand md:hidden"
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`absolute inset-x-0 top-full overflow-hidden border-b border-line bg-white shadow-xl transition-[opacity,transform,visibility] duration-200 md:hidden ${
          isOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain px-5 py-4">
          <nav className="divide-y divide-line" aria-label="Mobile navigation">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                onClick={() => setIsOpen(false)}
                className="flex min-h-12 items-center justify-between py-3 text-[15px] font-semibold text-ink transition-colors hover:text-brand"
              >
                {item.label}
                {item.external ? <ArrowUpRight className="h-4 w-4 text-muted" /> : null}
              </Link>
            ))}
          </nav>
          <div className="grid grid-cols-2 gap-3 border-t border-line pt-4">
            <Link href="/login" onClick={() => setIsOpen(false)} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-line bg-white px-4 text-sm font-semibold text-ink">Log in</Link>
            <Link href="/register" onClick={() => setIsOpen(false)} className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand px-4 text-sm font-semibold text-white">Sign up</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
