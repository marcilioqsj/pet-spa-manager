import { PawPrint, LogIn } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { funcionarios } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 p-4">
      <Card className="w-full max-w-sm border-none shadow-xl">
        <CardContent className="p-8 space-y-6">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <PawPrint className="h-7 w-7" />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold tracking-tight">PetCare</h1>
              <p className="text-sm text-muted-foreground">Banho & Tosa</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-center text-muted-foreground">Selecione seu perfil para entrar</p>
            {funcionarios.filter(f => f.ativo).map(func => (
              <Button
                key={func.id}
                variant="outline"
                className="w-full justify-between h-12"
                onClick={() => login(func.id)}
              >
                <div className="text-left">
                  <span className="font-semibold">{func.nome}</span>
                  <span className="text-xs text-muted-foreground ml-2 capitalize">{func.cargo}</span>
                </div>
                <LogIn className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
