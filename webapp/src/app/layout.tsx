import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import '@/styles/index.css'

export const metadata: Metadata = {
  title: 'Parallax - Security Reconnaissance Dashboard',
  description: 'Security reconnaissance and vulnerability assessment dashboard',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* Prevent flash of wrong theme */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    var theme = localStorage.getItem('parallax-theme');
                    if (theme === 'dark' || theme === 'light') {
                      document.documentElement.setAttribute('data-theme', theme);
                    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                      document.documentElement.setAttribute('data-theme', 'light');
                    } else {
                      document.documentElement.setAttribute('data-theme', 'dark');
                    }
                  } catch (e) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                })();
              `,
            }}
          />
        </head>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
