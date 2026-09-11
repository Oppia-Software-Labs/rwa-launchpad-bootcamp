import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { WalletProvider } from "@/lib/wallet-context";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RWA Launchpad | Oppia × Stellar Bolivia Bootcamp · Día 1",
  description:
    "Demo frontend for the Día 1 RWA Launchpad Soroban contract: deploy, configure stellar.toml, and initialize your asset on Stellar testnet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans`}>
        <WalletProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="mx-auto w-full max-w-layout flex-1 px-4 py-8 md:px-6 md:py-10">
              {children}
            </main>
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
