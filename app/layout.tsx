import type { Metadata } from "next";
import { Inter, Geist_Mono, Instrument_Sans } from "next/font/google";
import Nav from "@/components/nav";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://blazejkustra.com"),
  title: {
    default: "Błażej Kustra",
    template: "%s | Błażej Kustra",
  },
  description:
    "Senior React Native Developer at Software Mansion. Building universal apps, open source libraries, and CookinBuddy.",
  openGraph: {
    title: "Błażej Kustra",
    description:
      "Senior React Native Developer at Software Mansion. Building universal apps, open source libraries, and CookinBuddy.",
    url: "https://blazejkustra.com",
    siteName: "Błażej Kustra",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    creator: "@blazejkustra_",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} ${instrumentSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Nav />
        {children}
      </body>
    </html>
  );
}
