import { SiteWalkthrough } from "@/components/apresentacao/SiteWalkthrough";

export const metadata = {
  title: "O que dá para fazer no Conecta PCD",
  description: "Apresentação curta do site para quem vai testar: perfil, vaga, empresa, rede e cursos.",
};

export default function ApresentacaoPage() {
  return <SiteWalkthrough />;
}
