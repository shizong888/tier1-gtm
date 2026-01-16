import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ConvexClientProvider } from '@/components/providers/convex-client-provider';

const meltmino = localFont({
  src: [
    {
      path: "../../public/fonts/meltmino/Meltmino-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/meltmino/Meltmino-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/meltmino/Meltmino-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/meltmino/Meltmino-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/meltmino/Meltmino-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/meltmino/Meltmino-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/meltmino/Meltmino-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/meltmino/Meltmino-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/meltmino/Meltmino-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-meltmino",
});

export const metadata: Metadata = {
  title: "Tier 1 | Go-To-Market Strategy",
  description: "Building the execution layer for professional crypto trading on-chain. Tier 1 combines deterministic execution, ultra-low latency, and institutional-grade liquidity.",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'icon', url: '/favicon/tier-1-favicon.svg', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    title: 'Tier 1 | Go-To-Market Strategy',
    description: 'Building the execution layer for professional crypto trading on-chain. Tier 1 combines deterministic execution, ultra-low latency, and institutional-grade liquidity.',
    url: 'https://tier1.com',
    siteName: 'Tier 1',
    images: [
      {
        url: '/favicon/android-chrome-512x512.png',
        width: 512,
        height: 512,
        alt: 'Tier 1 Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tier 1 | Go-To-Market Strategy',
    description: 'Building the execution layer for professional crypto trading on-chain. Tier 1 combines deterministic execution, ultra-low latency, and institutional-grade liquidity.',
    images: ['/favicon/android-chrome-512x512.png'],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${meltmino.variable} antialiased font-sans`}
      >
        <ConvexClientProvider>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
