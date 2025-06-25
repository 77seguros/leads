import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.scss";
import "./page.scss";

export const metadata: Metadata = {
  title: "77 Seguros - Consultores",
  description: "Seguros automotivos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://vercel.com/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
      <Analytics />
    </html>
  );
}
