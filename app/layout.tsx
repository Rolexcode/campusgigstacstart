import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DemoStoreProvider } from "./lib/demo-store";
import "./globals.css";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: { default: "CampusGig", template: "%s — CampusGig" },
  description:
    "CampusGig helps verified university students earn their first opportunity by proving their skills through practical tasks.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <DemoStoreProvider>{children}</DemoStoreProvider>
      </body>
    </html>
  );
}
