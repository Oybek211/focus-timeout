import Image from "next/image";
import Link from "next/link";
import NavLinks from "@/components/layout/site-nav-links";
import SiteNavMobile from "@/components/layout/site-nav-mobile";
import HelpBanner from "@/components/layout/help-banner";
import LocaleSwitcher from "@/components/layout/locale-switcher";

export default function SiteHeader() {
  return (
    <div className="sticky top-0 z-40">
      <header className="h-18 border-b border-white/5 bg-black/30 backdrop-blur-lg">
        <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-10">
          <Link href="/" className="flex items-center gap-3 h-20">
            <div className="relative w-32 h-20">
              <Image src="/logo.png" alt="Focus Timeout logo" fill className="h-full w-full object-contain" />
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <NavLinks />
            <LocaleSwitcher />
            <SiteNavMobile />
          </div>
        </div>
      </header>
      <HelpBanner />
    </div>
  );
}
