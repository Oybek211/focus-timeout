"use client";

import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/hooks/use-locale";
import { locales, Locale } from "@/lib/i18n";

export default function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 border-white/10 bg-white/5 px-2 text-xs font-medium uppercase hover:bg-white/10"
        >
          {locale}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-20">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc.code}
            onClick={() => setLocale(loc.code as Locale)}
            className={locale === loc.code ? "bg-accent font-medium" : ""}
          >
            {loc.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
