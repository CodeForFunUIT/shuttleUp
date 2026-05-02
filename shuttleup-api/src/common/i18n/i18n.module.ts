import { Global, Inject, Injectable, Module, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Injectable({ scope: Scope.REQUEST })
export class I18nService {
  private translations: Record<string, any> = {};
  private defaultLocale = 'en';

  constructor(@Inject(REQUEST) private request: Request) {
    this.loadTranslations();
  }

  private loadTranslations() {
    // Load once and cache in memory would be better for prod, 
    // but for simplicity we load here or use static properties if we want to share.
    // Let's use a static cache so we don't read from disk on every request.
    if (!I18nService.cacheLoaded) {
      const localesPath = path.join(__dirname, 'locales');
      try {
        const files = fs.readdirSync(localesPath);
        for (const file of files) {
          if (file.endsWith('.json')) {
            const locale = file.replace('.json', '');
            const content = fs.readFileSync(path.join(localesPath, file), 'utf8');
            I18nService.globalTranslations[locale] = JSON.parse(content);
          }
        }
        I18nService.cacheLoaded = true;
      } catch (e) {
        console.warn('Failed to load translations from', localesPath);
      }
    }
    
    this.translations = I18nService.globalTranslations;
  }

  private static globalTranslations: Record<string, any> = {};
  private static cacheLoaded = false;

  get currentLocale(): string {
    const acceptLanguage = this.request.headers['accept-language'];
    if (!acceptLanguage) return this.defaultLocale;
    
    // Parse accept-language (e.g., "vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7")
    const languages = acceptLanguage.split(',').map((l) => l.split(';')[0].trim().toLowerCase());
    
    for (const lang of languages) {
      if (lang.startsWith('vi')) return 'vi';
      if (lang.startsWith('en')) return 'en';
    }
    
    return this.defaultLocale;
  }

  translate(key: string, args?: Record<string, string | number>): string {
    const keys = key.split('.');
    let result = this.translations[this.currentLocale];

    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        // Fallback to default locale
        let fallbackResult = this.translations[this.defaultLocale];
        for (const fk of keys) {
          if (fallbackResult && fallbackResult[fk]) {
            fallbackResult = fallbackResult[fk];
          } else {
            return key; // Return key if not found at all
          }
        }
        result = fallbackResult;
        break;
      }
    }

    if (typeof result !== 'string') return key;

    let text = result as string;
    if (args) {
      for (const [k, v] of Object.entries(args)) {
        text = text.replace(new RegExp(`{${k}}`, 'g'), String(v));
      }
    }

    return text;
  }
}

@Global()
@Module({
  providers: [I18nService],
  exports: [I18nService],
})
export class I18nModule {}
