import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
