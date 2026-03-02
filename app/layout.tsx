import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Muhammad Saad Amin - Portfolio',
  description: 'A comprehensive portfolio showcasing 150+ web development projects including HTML, CSS, JavaScript, React, and Python',
  icons: {
    icon: '/Images/ChatGPT_Image_Dec_13__2025__04_30_10_AM-removebg-preview.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/Images/ChatGPT_Image_Dec_13__2025__04_30_10_AM-removebg-preview.png" />
        <link rel="stylesheet" href="/Home.css" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
