import { AuthProvider } from "./features/auth/context/AuthContext";
import AppRouter from "./shared/routes/AppRouter";


// APP ROOT
// El enrutamiento real (BrowserRouter) se monta en main.tsx.
// Aquí solo envolvemos toda la app con el AuthProvider para que
// cualquier página pueda usar useAuth().


export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
