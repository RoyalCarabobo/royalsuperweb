import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Royal Venezuela | Royal Super Oil",
  description: "Distribuidor Oficial Royal Super Oil Valencia Venezuela",
  keywords: ["lubricantes", "royal", "super", "oil", "royal super oil", "aceites", "venezuela"],
};

// src/app/layout.js
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* Añadimos suppressHydrationWarning aquí */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <div className="min-h-screen">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
