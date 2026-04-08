import { LayoutDashboard, Route, ScrollText, TrendingUp, LogOut, User, CalendarDays, ExternalLink, Home, MapPinCheck, BarChart3, ClipboardList } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "CRM", url: "/", icon: LayoutDashboard },
  { title: "Evolução Comercial", url: "/evolucao", icon: TrendingUp },
  { title: "Agenda de Visitas", url: "/agenda", icon: CalendarDays },
  { title: "Roteiro", url: "/roteiro", icon: Route },
  { title: "Log de Atividades", url: "/log", icon: ScrollText },
  { title: "Home Equity", url: "/home-equity", icon: Home },
  { title: "Gestão Comercial", url: "/gestao-campo", icon: MapPinCheck },
  { title: "Dashboard Gestor", url: "/dashboard-gestor", icon: BarChart3 },
  { title: "Agenda Sugerida", url: "/agenda-sugerida", icon: ClipboardList },
];

interface AppSidebarProps {
  currentUser: string;
  onLogout: () => void;
}

export function AppSidebar({ currentUser, onLogout }: AppSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="gold-text font-bold text-xs">
            {!collapsed && "📊 VF Recorrência"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-muted/50"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-muted-foreground">
            {!collapsed && "Portais"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a
                    href="https://facilita.vfbankdigital.com.br/auth/login"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:bg-muted/50 flex items-center"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {!collapsed && <span>Portal Recorrência</span>}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a
                    href="https://vfbankdigital.com.br/cred/index.php"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:bg-muted/50 flex items-center"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {!collapsed && <span>Portal Credenciamento</span>}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-2">
        {!collapsed && (
          <div className="flex items-center gap-2 px-2 py-1">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground truncate">{currentUser}</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="w-full justify-start text-muted-foreground hover:text-destructive"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {!collapsed && "Sair"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
