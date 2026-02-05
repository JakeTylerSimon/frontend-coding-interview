import type { Metadata } from "next";
import DashboardClient from "./dashboardClient";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Browse images retrieved from Images API.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Dashboard",
    description: "Browse images retrieved from Images API.",
    type: "website",
  },
};

export default function DashboardPage() {
  return <DashboardClient />;
}
