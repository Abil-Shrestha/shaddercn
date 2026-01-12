import { Geist, Geist_Mono } from "next/font/google";

export const fontSans = Geist({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontHeading = Geist({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-heading",
});

export const fontMono = Geist_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-mono",
});
