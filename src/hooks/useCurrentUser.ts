import { useSession } from "next-auth/react";

/**
 * Hook to get the current user session
 */
export function useCurrentUser() {
  const { data: session, status } = useSession();
  return {
    user: session?.user,
    loading: status === "loading",
    isAuthenticated: !!session,
  };
}
