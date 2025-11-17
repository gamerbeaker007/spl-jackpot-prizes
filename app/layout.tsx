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
        <MuiThemeProvider>
          <Navigation />
          {children}
        </MuiThemeProvider>
      </body>
    </html>
  );
}
