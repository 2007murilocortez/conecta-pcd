import { getMyCompanies } from "@/lib/actions/company";
import { countUnreadNotifications } from "@/lib/actions/notifications";
import { getAuthedUser } from "@/lib/supabase/user";
import { HeaderBar } from "@/components/layout/HeaderBar";

export async function Header() {
  const { userId } = await getAuthedUser();
  const memberships = userId ? await getMyCompanies() : [];
  const unreadCount = userId ? await countUnreadNotifications() : 0;

  return (
    <HeaderBar
      isLoggedIn={Boolean(userId)}
      unreadCount={unreadCount}
      companies={memberships.map((item) => ({
        id: item.company.id,
        name: item.company.name,
      }))}
    />
  );
}
