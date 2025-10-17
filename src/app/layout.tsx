import type { Metadata } from "next";
import "@/styles/main.scss";
import Providers from "./providers";
import SiteHeader from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Trello Clone",
  description: "A simple Trello clone built with Next.js, TypeScript, and SCSS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <SiteHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
