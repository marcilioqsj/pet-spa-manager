import { createContext, useContext, useState, type ReactNode } from "react";
import { funcionarios, type Funcionario } from "@/data/mockData";

interface AuthContextType {
  usuario: Funcionario | null;
  login: (id: string) => void;
  logout: () => void;
  isAdmin: boolean;
  temPermissao: (modulo: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Funcionario | null>(null);

  const login = (id: string) => {
    const func = funcionarios.find(f => f.id === id);
    if (func) setUsuario(func);
  };

  const logout = () => setUsuario(null);

  const isAdmin = usuario?.papel === 'admin';

  const temPermissao = (modulo: string) => {
    if (!usuario) return false;
    if (isAdmin) return true;
    return usuario.permissoes.includes(modulo);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, isAdmin, temPermissao }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
