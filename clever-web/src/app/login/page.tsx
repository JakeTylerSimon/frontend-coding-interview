import type { Metadata } from "next";
import LoginClient from "./loginClient";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to access your Clever image dashboard.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Sign in",
    description: "Sign in to access your Clever image dashboard.",
    type: "website",
  },
};

export default function LoginPage() {
  return <LoginClient />;
}
