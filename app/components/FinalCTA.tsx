import Link from "next/link";
import Image from "next/image";
import DownloadModal from "./DownloadModal";
import { getPublicCommunity } from "@/lib/public-community";

export default async function FinalCTA() {
  const community = await getPublicCommunity();
  return (
    <section className="bg-white pb-16 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-brand px-5 py-12 text-center sm:px-8 lg:px-12 lg:py-16">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-white/10">
            <Image
              src="/images/white_logo.png"
              alt=""
              width={38}
              height={38}
              className="h-10 w-10 object-contain"
            />
          </div>

          <div className="mx-auto mt-6 max-w-2xl">
            <h2 className="font-accent text-3xl font-black leading-[1.15] tracking-tight text-white sm:text-4xl">
              Ready to ace your exam?
            </h2>
            <p className="mt-5 text-base sm:text-lg text-white/85 font-medium leading-relaxed">
              Join {community.displayedCommunitySize.toLocaleString()}+ Ethiopian
              students studying smarter with Prime UAT.
              Start free today with web access or scan the app QR from your phone.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-brand transition-colors hover:bg-white/90 sm:w-auto"
              >
                Start Preparing Free
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <DownloadModal
                label="Scan app QR"
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/40 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-white/10 sm:w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
