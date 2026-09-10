import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily Habit Fitness Gym",
  description:
    "Build a consistent fitness habit with Daily Habit Fitness Gym. Register your interest and plan your first visit.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
