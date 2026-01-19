"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/hooks/use-locale";

export default function NavLinks() {
  const pathname = usePathname();
  const t = useTranslations();

  const links = [
    { href: "/", label: t.home },
    { href: "/settings", label: t.settings },
    { href: "/statistics", label: t.statistics },
    { href: "/help", label: t.help },
    { href: "/about", label: t.about },
  ];

  return (
    <nav className="hidden items-center gap-2 text-sm font-medium text-white/70 md:flex">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-full px-3 py-1.5 transition",
              isActive
                ? "bg-white/10 text-white"
                : "hover:bg-white/5 hover:text-white"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
