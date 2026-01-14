import "./globals.css";

import { fontHeading, fontMono, fontSans } from "@shaddercn/ui/fonts";
import { ThemeProvider } from "@shaddercn/ui/shared/theme-provider";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { ReactScan } from "@/components/react-scan";
import { SiteHeader } from "@/components/site-header";
import {
  AnchoredToastProvider,
  ToastProvider,
} from "@/registry/default/ui/toast";

export const metadata: Metadata = {
  description:
    "Shaddercn is an agent-native design system built for coding agents.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  title: "Shaddercn - Agent-native design system built for coding agents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontHeading.variable} ${fontMono.variable} relative bg-sidebar font-sans text-foreground antialiased`}
      >
        <ThemeProvider>
          <ToastProvider>
            <AnchoredToastProvider>
              <div className="relative isolate flex min-h-svh flex-col overflow-clip [--header-height:4rem]">
                <div
                  aria-hidden="true"
                  className="before:-left-3 after:-right-3 container pointer-events-none absolute inset-0 z-45 before:absolute before:inset-y-0 before:w-px before:bg-border/64 after:absolute after:inset-y-0 after:w-px after:bg-border/64"
                />
                <SiteHeader />
                <ReactScan />
                {children}
              </div>
            </AnchoredToastProvider>
          </ToastProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
