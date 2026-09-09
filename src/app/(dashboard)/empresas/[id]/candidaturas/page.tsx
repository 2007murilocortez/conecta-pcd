import { redirect } from "next/navigation";

export default async function EmpresaCandidaturasPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/candidaturas?empresa=${id}`);
}
