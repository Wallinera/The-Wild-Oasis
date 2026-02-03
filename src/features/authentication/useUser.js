import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";

// gets the current user and loads it to the cash
export function useUser() {
  const {
    isPending: isLoading,
    data: user,
    fetchStatus,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });

  return {
    isLoading,
    user,
    isAuthenticated: user?.role === "authenticated",
    fetchStatus,
  };
}
