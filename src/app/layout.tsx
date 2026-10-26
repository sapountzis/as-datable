import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "@/components/figures/explainers.css";
import Layout from "@/components/layout/Layout";

const instrument = localFont({
  src: "../../public/fonts/instrument-sans.woff2",
  variable: "--font-instrument",
  weight: "400 700",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL("https://asdatable.com"),
  title: {
    default: "Andreas Sapountzis — Machine learning, statistics & software",
    template: "%s · Andreas Sapountzis",
  },
  description:
    "Technical work and interests in machine learning, statistical modeling, language-model evaluation, and software. Andreas Sapountzis’s personal website.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Andreas Sapountzis",
    description: "Machine learning, statistics & software",
    type: "website",
    images: ["/og.png"],
  },
  twitter: { card: "summary_large_image" },
};
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f9fc" },
    { media: "(prefers-color-scheme: dark)", color: "#111923" },
  ],
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');document.documentElement.classList.add(t==='light'||t==='dark'?t:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch(e){}})()`,
          }}
        />
      </head>
      <body className={instrument.variable}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
