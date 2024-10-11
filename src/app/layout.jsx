"use client";

import "./globals.css";

import { Poppins } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({ subsets: ["latin"], weight: "400" });
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>DocuMate - Let's make your coding journey much more easy</title>
        <link rel="icon" href="my-favicon-32x32.png" type="image/x-icon"></link>
      </head>
      <body className={`${poppins.className} relative`}>
        <main className="relative z-10 mx-auto">
          <Toaster position="bottom-center" />
          {children} <Analytics />
        </main>
      </body>

      {/* <!-- Google tag (gtag.js) --> */}
      {/* afterInteractive is the default strategy */}
      <Script
        async
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-BKK7659J87"
      />
      <Script strategy="afterInteractive" src="/analytics.js" />
    </html>
  );
}
