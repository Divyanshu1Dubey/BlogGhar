import { useSession } from "next-auth/react";

/**
 * Hook to check if the current user is an admin
 */
export function useIsAdmin() {
  const { data: session } = useSession();
  return (session?.user as { role?: string } | null)?.role === "admin";
}
