import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  icons: [{ rel: "icon", url: "/favicon.png" }],
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang?: string }>;
}) {
  const { lang = "fi" } = await params;

  return (
    <html lang={lang}>
      <body>{children}</body>
    </html>
  );
}
