import type { Metadata } from "next";
import { IBM_Plex_Serif, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const ibmPlexSerif = IBM_Plex_Serif({
	variable: "--font-display",
	subsets: ["latin"],
	weight: ["600", "700"],
	display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
	variable: "--font-body",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	display: "swap",
});

export const metadata: Metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://as-datable.com"),
	title: "Andreas Sapountzis — Senior Data & AI Systems Engineer",
	description:
		"I design and build production AI systems and data platforms that work.",
	icons: {
		icon: "/logo.ico",
	},
	openGraph: {
		title: "Andreas Sapountzis — Senior Data & AI Systems Engineer",
		description:
			"AI system architecture + data engineering + production software.",
		type: "website",
		images: ["/as-logo.webp"],
	},
	other: {
		"theme-color": "#0a0d14",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				{/* DNS prefetch for external resources */}
				<link rel="dns-prefetch" href="https://www.googletagmanager.com" />
				<link rel="dns-prefetch" href="https://calendly.com" />

				{/* GA4 with consent mode */}
				<Script
					src="https://www.googletagmanager.com/gtag/js?id=G-0G1JNTY6WR"
					strategy="afterInteractive"
				/>
				<Script id="gtag-init" strategy="afterInteractive">
					{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('consent', 'default', { 'analytics_storage': 'denied' });
            gtag('config', 'G-0G1JNTY6WR');
          `}
				</Script>
			</head>
			<body
				className={`${ibmPlexSerif.variable} ${plusJakartaSans.variable} antialiased`}
			>
				{children}
				<Toaster />
			</body>
		</html>
	);
}
