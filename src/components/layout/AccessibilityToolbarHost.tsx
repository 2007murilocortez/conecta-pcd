import { getAccessibilityPrefs } from "@/lib/actions/accessibility";
import { AccessibilityToolbar } from "@/components/layout/AccessibilityToolbar";

export async function AccessibilityToolbarHost() {
  const result = await getAccessibilityPrefs();

  return <AccessibilityToolbar initial={result.data} persist={result.persisted} />;
}
