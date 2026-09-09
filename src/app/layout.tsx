import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AccessibilityToolbar } from "@/components/layout/AccessibilityToolbar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { VLibrasWidget } from "@/components/layout/VLibrasWidget";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Conecta PCD — Rede profissional para pessoas com deficiência",
  description:
    "Encontre vagas filtráveis por acessibilidade, avalie empresas e construa sua rede profissional.",
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
          <AccessibilityToolbar />
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
