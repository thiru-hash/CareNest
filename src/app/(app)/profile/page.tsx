import { getCurrentUser } from "@/lib/auth";
import { ProfileClient } from "@/components/profile/ProfileClient";

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();

  return <ProfileClient currentUser={currentUser} />;
}
