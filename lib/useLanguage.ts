'use client';

import { setUserLocale } from '@/services/locale';
import { Locale } from '@/i18n/config';
import { useTransition } from 'react';
import { useLocale } from 'next-intl';

export function useLanguage() {
  const [, startTransition] = useTransition();
  const locale = useLocale();
  const changeLanguage = (newLocale: Locale) => {
    startTransition(() => {
      setUserLocale(newLocale as Locale);
    });
  };

  return { locale,changeLanguage };
} 