import type { Metadata } from "next";
import { DynaPuff, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Chunky display font
const dynaPuff = DynaPuff({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

// Crisp monospace font
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Ribbon 🎀 - Make Your Ask",
  description: "Create a personalized link to ask your crush out",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${dynaPuff.variable} ${jetbrainsMono.variable} font-mono antialiased`}>
        {children}
      </body>
    </html>
  );
}