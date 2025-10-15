import AppRoutes from "./router/AppRoutes";
import { useSyncUser } from "./hooks/useSyncUser";

function App() {
  useSyncUser();

  return <AppRoutes />;
}

export default App;
