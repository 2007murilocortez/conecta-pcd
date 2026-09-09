import { getMyCompanies } from "@/lib/actions/company";
import { getAuthedUser } from "@/lib/supabase/user";
import { HeaderBar } from "@/components/layout/HeaderBar";

export async function Header() {
  const { userId } = await getAuthedUser();
  const memberships = userId ? await getMyCompanies() : [];

  return (
    <HeaderBar
      isLoggedIn={Boolean(userId)}
      companies={memberships.map((item) => ({
        id: item.company.id,
        name: item.company.name,
      }))}
    />
  );
}
