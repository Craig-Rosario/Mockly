import { useAuth } from "@clerk/react-router";
import { useEffect, useState } from "react";

// API base URLs with fallback (deployed first, then local)
const API_BASE_URLS = [
  'https://mockly-backend.vercel.app/api',
  'http://localhost:5000/api',
];

export const useSyncUser = () => {
  const { getToken, isSignedIn, userId } = useAuth();
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    const syncUser = async () => {
      if (!isSignedIn || !userId || isSynced) return;
      
      console.log("Syncing user with Clerk ID:", userId);
      const token = await getToken();
      
      // Try each base URL until one works
      for (const baseUrl of API_BASE_URLS) {
        const url = `${baseUrl}/users/sync-user`;
        
        try {
          console.log(`Trying to sync user with: ${url}`);
          
          const response = await fetch(url, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            console.log(`User synced successfully with: ${url}`, userData);
            setIsSynced(true);
            return; // Exit on success
          } else {
            console.error(`Failed to sync user with ${url}:`, response.statusText);
            
            // If it's the last URL, we've tried everything
            if (baseUrl === API_BASE_URLS[API_BASE_URLS.length - 1]) {
              console.error("All sync endpoints failed");
            }
          }
        } catch (err) {
          console.error(`Failed to connect to ${url}:`, err);
          
          // If it's the last URL, we've tried everything
          if (baseUrl === API_BASE_URLS[API_BASE_URLS.length - 1]) {
            console.error("All sync endpoints failed with errors");
          }
        }
      }
    };
    
    syncUser();
  }, [isSignedIn, userId, getToken, isSynced]);

  return { isSynced };
};
