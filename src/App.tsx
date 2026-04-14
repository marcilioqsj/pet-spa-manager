import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Agendamentos from "@/pages/Agendamentos";
import PetsTutores from "@/pages/PetsTutores";
import Financeiro from "@/pages/Financeiro";
import FilaAtendimento from "@/pages/FilaAtendimento";
import Servicos from "@/pages/Servicos";
import Configuracoes from "@/pages/Configuracoes";
import Equipe from "@/pages/Equipe";
import Comissoes from "@/pages/Comissoes";
import MinhasComissoes from "@/pages/MinhasComissoes";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { usuario } = useAuth();

  if (!usuario) return <Login />;

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/agendamentos" element={<Agendamentos />} />
        <Route path="/fila" element={<FilaAtendimento />} />
        <Route path="/pets-tutores" element={<PetsTutores />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/financeiro" element={<Financeiro />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/equipe" element={<Equipe />} />
        <Route path="/comissoes" element={<Comissoes />} />
        <Route path="/minhas-comissoes" element={<MinhasComissoes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
