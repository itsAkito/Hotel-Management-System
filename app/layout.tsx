import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import NavBar from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/theme-provider";
import HotelToast from "@/components/HotelToast";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const clerkPubKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export const metadata: Metadata = {
  title: "QUICKSTAY",
  description: "Book a hotel of your choice",
  icons: {
    icon: '/images/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider publishableKey={clerkPubKey}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <HotelToast message="Operation successful" />
            <main className="flex flex-col min-h-screen bg-secondary">
              <NavBar />
              <section className="flex-grow">
                {children}
              </section>
            </main>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}