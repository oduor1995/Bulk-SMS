'use client';
import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import './global.css';
import Head from 'next/head';
//import { GroupProvider } from './GroupContext';
//import { UserProvider } from '@auth0/nextjs-auth0/client';
import { GroupProvider } from './GroupContext';
import Script from 'next/script';
import { RowIdProvider } from './rowIdContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <title>Bulk SMS</title>
      </Head>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js"
        strategy="lazyOnload"
        onLoad={() =>
          console.log(`script loaded correctly, window.FB has been populated`)
        }
      />
      <body className={`${inter.className} antialiased`}>
        {' '}
        <RowIdProvider>{children}</RowIdProvider>
      </body>
    </html>
  );
}
