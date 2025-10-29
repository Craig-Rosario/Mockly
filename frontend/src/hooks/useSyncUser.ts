import { useAuth } from "@clerk/react-router";
import { useEffect, useState } from "react";

export const useSyncUser = () => {
  const { getToken, isSignedIn, userId } = useAuth();
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    const syncUser = async () => {
      if (!isSignedIn || !userId || isSynced) return;
      
      try {
        console.log("Syncing user with Clerk ID:", userId);
        const token = await getToken();
        
        const response = await fetch("/api/users/sync-user", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        
        if (response.ok) {
          const userData = await response.json();
          console.log("User synced successfully:", userData);
          setIsSynced(true);
        } else {
          console.error("Failed to sync user:", response.statusText);
        }
      } catch (err) {
        console.error("Failed to sync user:", err);
      }
    };
    
    syncUser();
  }, [isSignedIn, userId, getToken, isSynced]);

  return { isSynced };
};
