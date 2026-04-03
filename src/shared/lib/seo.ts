import type { Metadata } from 'next';

import { env } from '@/shared/lib/env';

type PageSeoConfig = {
  title: string;
  description: string;
  path: string;
  index: boolean;
};

const siteUrl = new URL(env.NEXTAUTH_URL);

export const siteConfig = {
  name: 'BetDay Lite',
  title: 'BetDay Lite | Demo de apuestas deportivas',
  description:
    'Aplicacion demo de apuestas deportivas con timeline de partidos, cuotas 1X2 y gestion simple de apuestas.',
  url: siteUrl,
  locale: 'es_PE',
};

export const rootMetadata: Metadata = {
  metadataBase: siteConfig.url,
  applicationName: siteConfig.name,
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    url: '/',
  },
  twitter: {
    card: 'summary',
    title: siteConfig.title,
    description: siteConfig.description,
  },
  icons: {
    icon: '/favicon.ico',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export function createPageMetadata(config: PageSeoConfig): Metadata {
  return {
    title: config.title,
    description: config.description,
    alternates: {
      canonical: config.path,
    },
    openGraph: {
      title: config.title,
      description: config.description,
      url: config.path,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: config.title,
      description: config.description,
    },
    robots: {
      index: config.index,
      follow: config.index,
    },
  };
}
