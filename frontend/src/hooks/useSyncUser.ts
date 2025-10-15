import { useAuth } from "@clerk/react-router";
import { useEffect } from "react";

export const useSyncUser = () => {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    const syncUser = async () => {
      if (!isSignedIn) return;
      try {
        const token = await getToken();
        await fetch("http://localhost:5000/api/sync-user", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.error("Failed to sync user:", err);
      }
    };
    syncUser();
  }, [isSignedIn, getToken]);
};
