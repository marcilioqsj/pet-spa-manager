import { LayoutDashboard, Calendar, PawPrint, DollarSign, ListChecks, Scissors, Settings, Users, TrendingUp, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const allItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, modulo: "dashboard" },
  { title: "Agendamentos", url: "/agendamentos", icon: Calendar, modulo: "agendamentos" },
  { title: "Fila do Dia", url: "/fila", icon: ListChecks, modulo: "fila" },
  { title: "Pets & Tutores", url: "/pets-tutores", icon: PawPrint, modulo: "pets-tutores" },
  { title: "Serviços", url: "/servicos", icon: Scissors, modulo: "servicos" },
  { title: "Financeiro", url: "/financeiro", icon: DollarSign, modulo: "financeiro" },
  { title: "Comissões", url: "/comissoes", icon: TrendingUp, modulo: "comissoes" },
  { title: "Equipe", url: "/equipe", icon: Users, modulo: "equipe" },
];

const funcItems = [
  { title: "Minhas Comissões", url: "/minhas-comissoes", icon: TrendingUp, modulo: "minhas-comissoes" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { usuario, logout, temPermissao } = useAuth();

  const menuItems = [
    ...allItems.filter(item => temPermissao(item.modulo)),
    ...funcItems.filter(item => temPermissao(item.modulo)),
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
            <PawPrint className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold text-sidebar-primary-foreground tracking-tight">PetCare</span>
              <span className="text-xs text-sidebar-foreground/60">Banho & Tosa</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2 space-y-1">
        <SidebarMenu>
          {temPermissao('configuracoes') && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location.pathname === '/configuracoes'}>
                <NavLink
                  to="/configuracoes"
                  end
                  className="hover:bg-sidebar-accent/50"
                  activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                >
                  <Settings className="h-4 w-4" />
                  {!collapsed && <span>Configurações</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button onClick={logout} className="w-full flex items-center gap-2 hover:bg-sidebar-accent/50 text-sidebar-foreground/70">
                <LogOut className="h-4 w-4" />
                {!collapsed && (
                  <div className="flex flex-col items-start">
                    <span className="text-xs">{usuario?.nome}</span>
                    <span className="text-[10px] text-sidebar-foreground/50 capitalize">{usuario?.cargo}</span>
                  </div>
                )}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
