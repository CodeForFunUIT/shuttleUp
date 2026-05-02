import { useTranslations } from "next-intl"

export function Footer() {
  const t = useTranslations('Footer');
  
  return (
    <footer className="w-full border-t bg-muted/50 py-8 mt-12">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-4">
        <p>{t('copyright', { year: new Date().getFullYear() })}</p>
        <p>{t('builtFor')}</p>
      </div>
    </footer>
  )
}
