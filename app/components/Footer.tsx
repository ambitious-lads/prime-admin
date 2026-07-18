import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Courses", href: "#courses" },
      { label: "Mock Tests", href: "#mock-tests" },
      { label: "Pricing", href: "#pricing" },
      { label: "Testimonials", href: "#testimonials" },
    ],
  },
  {
    title: "AAU Resources",
    links: [
      { label: "UAT Guide", href: "/uat-guide" },
      { label: "Cutoff Points", href: "/cutoff-points" },
      { label: "Tuition Fees", href: "/tuition" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Contact", href: site.supportTelegramUrl },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "#faq" },
      { label: "Status", href: "/status" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Delete Account", href: "/delete-account" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo.png"
                alt="Prime UAT logo"
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
              <span className="text-xl font-black font-accent text-ink">
                Prime UAT
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted font-medium leading-relaxed">
              An independent preparation platform for Ethiopian students preparing for the AAU Undergraduate Admission Test. Prime UAT is not affiliated with Addis Ababa University.
            </p>
          </div>

          {/* Link columns */}
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-ink">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-sm font-medium text-muted transition-colors duration-200 hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 sm:flex-row">
          <p className="text-sm text-muted font-medium">
            © 2026 Prime UAT. All rights reserved.
          </p>
          <p className="text-sm text-muted font-medium">
            Built for Ethiopian students
          </p>
        </div>
      </div>
    </footer>
  );
}
