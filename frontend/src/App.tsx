import AppRoutes from "./router/AppRoutes";
import { useSyncUser } from "./hooks/useSyncUser";
import { useAuth } from "@clerk/react-router";

function App() {
  const { isSynced } = useSyncUser();
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (isSignedIn && !isSynced) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Setting up your account...</p>
        </div>
      </div>
    );
  }

  return <AppRoutes />;
}

export default App;
