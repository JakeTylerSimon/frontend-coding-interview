import "./globals.css";
import type { Metadata } from "next";
import { ToastProvider } from "@/components/Toast";

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: "Clever Web Images",
    template: "%s | Clever Web Images",
  },
  description: "Web App to pull Images from API",
  applicationName: "Clever Web Images",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    siteName: "Clever Web Images",
    title: "Clever Web Images",
    description: "Web App to pull Images from API",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
