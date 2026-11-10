import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AccessibilityToolbarHost } from "@/components/layout/AccessibilityToolbarHost";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { VLibrasWidget } from "@/components/layout/VLibrasWidget";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
  // Sem isso o fallback do next/font encolhe o espaço e o texto cola no Safari/Chrome.
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Conecta PCD — Rede profissional para pessoas com deficiência",
  description:
    "Encontre vagas que informam os recursos de acessibilidade, avalie empresas e construa sua rede profissional.",
  icons: {
    icon: "/brand/conecta-pcd-icon-192.png",
    apple: "/brand/conecta-pcd-icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full`}>
      <body className={`${inter.className} flex min-h-full flex-col antialiased`}>
        <TooltipProvider>
          <a href="#conteudo-principal" className="skip-link">
            Pular para o conteúdo principal
          </a>
          <Header />
          <AccessibilityToolbarHost />
          <main id="conteudo-principal" className="flex-1">
            {children}
          </main>
          <Footer />
          <VLibrasWidget />
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
