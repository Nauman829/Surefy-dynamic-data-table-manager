import './globals.css';
import { Inter } from 'next/font/google';
import Providers from './providers'; // Import the providers

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Dynamic Data Table Manager',
  description: 'Frontend Interview Task built with Next.js, Redux, and MUI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap content with the Providers component */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}