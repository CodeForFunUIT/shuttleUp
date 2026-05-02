"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { useTransition } from "react";
import { Locale } from "@/i18n/routing";

export function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (nextLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale as Locale });
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent hover:text-accent-foreground disabled:opacity-50" disabled={isPending}>
        <Globe className="h-4 w-4" />
        <span className="sr-only">{t('toggleLanguage')}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => switchLocale("en")}
          className={locale === "en" ? "bg-accent" : ""}
        >
          {t('english')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => switchLocale("vi")}
          className={locale === "vi" ? "bg-accent" : ""}
        >
          {t('vietnamese')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
