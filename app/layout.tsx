import type { Metadata, Viewport } from "next";
import { Albert_Sans, Fragment_Mono } from "next/font/google";
import "./globals.css";

const albertSans = Albert_Sans({
  subsets: ["latin"],
  variable: "--font-albert",
  display: "swap",
});

const fragmentMono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-fragment",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shubham Kumar — AI & Data Science Student | Aspiring Software Developer",
  description:
    "Shubham Kumar is a 3rd-year BTech student in AI & Data Science at Galgotias College of Engineering and Technology, building projects and sharpening his problem-solving skills.",
};

// viewport-fit=cover lets env(safe-area-inset-*) work on notched phones.
// Zoom is intentionally NOT disabled.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#edf5ff",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${albertSans.variable} ${fragmentMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
