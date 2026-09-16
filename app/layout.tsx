import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily Habit Fitness Gym",
  description:
    "Build a consistent fitness habit with Daily Habit Fitness Gym. Register your interest and plan your first visit.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body>
        <Script id="theme-initializer" strategy="beforeInteractive">
          {`(() => { try { const saved = localStorage.getItem("daily-habit-theme"); if (saved === "light" || saved === "dark") document.documentElement.dataset.theme = saved; } catch {} })();`}
        </Script>
        {children}
      </body>
    </html>
  );
}
