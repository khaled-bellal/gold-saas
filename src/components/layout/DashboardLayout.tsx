import React from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  BarChart3,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "../../lib/utils";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
      active
        ? "bg-gold text-black shadow-lg shadow-gold/20 font-medium"
        : "text-white/60 hover:text-white hover:bg-white/5"
    )}
  >
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

export const DashboardLayout: React.FC<{
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}> = ({ children, activeTab, setActiveTab }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "sales", label: "Sales", icon: ShoppingCart },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/5 p-6 bg-surface-raised">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-xl uppercase italic">A</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">Aurum SaaS</h1>
            <p className="text-[10px] uppercase tracking-widest text-white/40">
              Gold Edition
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
            />
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <NavItem icon={LogOut} label="Logout" onClick={() => console.log("Logout")} />
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-surface-raised p-6 flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-xl font-bold tracking-tight text-white">Aurum SaaS</h1>
            <button onClick={() => setIsMobileMenuOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <nav className="flex-1 space-y-2 text-white">
            {navItems.map((item) => (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={activeTab === item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
              />
            ))}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-surface">
        <header className="h-16 flex items-center justify-between px-6 md:px-10 border-b border-white/5 bg-surface/80 backdrop-blur-xl sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-medium text-white capitalize">{activeTab}</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">Gold Shop Admin</p>
              <p className="text-xs text-white/50">staff@goldshop.com</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-surface-top border border-white/10 flex items-center justify-center">
              <span className="text-xs font-bold text-gold">GS</span>
            </div>
          </div>
        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">{children}</div>
      </main>
    </div>
  );
};