import { BrandLogo } from "@/components/brand/BrandLogo";
import { OrbitalBackdrop } from "@/components/brand/OrbitalBackdrop";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative overflow-hidden bg-bg">
      <div className="mx-auto grid min-h-[calc(100vh-12rem)] w-full max-w-6xl lg:grid-cols-2">
        <aside className="relative hidden overflow-hidden bg-primary-dark p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <OrbitalBackdrop />
          <div className="relative">
            <div className="inline-flex rounded-2xl bg-white p-4">
              <BrandLogo variant="slogan" />
            </div>
            <h2 className="mt-10 text-white">Oportunidades com acessibilidade visível.</h2>
            <p className="mt-4 mb-0 max-w-md text-white/90">
              Entre para explorar vagas, empresas e uma rede profissional pensada
              para pessoas com deficiência.
            </p>
          </div>
          <p className="relative mb-0 text-sm text-white/75">
            Uma conta só. Depois, se quiser recrutar, você cria a página da empresa por dentro.
          </p>
        </aside>
        <div className="flex items-center px-4 py-10 sm:py-14">
          <div className="surface-card mx-auto w-full max-w-md p-6 sm:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
