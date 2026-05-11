import './globals.css';
import { Inter } from 'next/font/google';
import Script from 'next/script'; // ✅ ADD THIS

const inter = Inter({
  subsets: ['latin'],
  weight: ['300','400','600','700']
});

export const metadata = {
  title: 'Fityro',
  description: 'A modern virtual try-on experience',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>

        {/* 🔥 Google Identity Services Script */}
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
        />

        {children}

      </body>
    </html>
  );
}
