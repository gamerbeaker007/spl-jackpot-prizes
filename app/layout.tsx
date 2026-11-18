import type { Metadata } from "next";
import MuiThemeProvider from "../components/ThemeProvider";
import Navigation from "../components/Navigation";

export const metadata: Metadata = {
  title: "SPL Data Dashboard",
  description: "Splinterlands card pack jackpot data and mint history display",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div
          role="alert"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1200,
            backgroundColor: '#5c0000',
            color: '#ffffff',
            textAlign: 'center',
            fontSize: '0.875rem',
            padding: '0.5rem 1rem',
            borderBottom: '1px solid #8b0000',
          }}
        >
          This page is no longer maintained. Go to{' '}
          <a href="https://spl-stats.com/" target="_blank" rel="noreferrer">
            https://spl-stats.com/
          </a>
          .
        </div>

        <MuiThemeProvider>
          <Navigation />
          {children}
        </MuiThemeProvider>
      </body>
    </html>
  );
}
