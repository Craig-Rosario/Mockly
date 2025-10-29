import { useAuth, useUser } from "@clerk/react-router";
import { useEffect, useState } from "react";

interface UserData {
  _id: string;
  name: string;
  email: string;
  clerkId: string;
}

interface UserGreetingProps {
  fallbackText?: string;
  className?: string;
}

export const UserGreeting: React.FC<UserGreetingProps> = ({ 
  fallbackText = "User", 
  className = "text-3xl font-bold text-white" 
}) => {
  const { getToken, isSignedIn } = useAuth();
  const { user: clerkUser } = useUser();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!isSignedIn) {
        setLoading(false);
        return;
      }

      try {
        const token = await getToken();
        const res = await fetch("/api/users/current-user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Cannot fetch user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isSignedIn, getToken]);

  if (loading) {
    return <div className={className}>Hi {fallbackText}</div>;
  }

  const displayName = user?.name || 
    (clerkUser?.firstName && clerkUser?.lastName 
      ? `${clerkUser.firstName} ${clerkUser.lastName}` 
      : clerkUser?.firstName || clerkUser?.username || fallbackText);

  return <div className={className}>Hi {displayName}</div>;
};

export default UserGreeting;