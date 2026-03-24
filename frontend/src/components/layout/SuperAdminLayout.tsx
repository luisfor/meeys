'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Building2, Settings, Users, LogOut, User as UserIcon, ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { ReactNode, useState, useEffect } from 'react';

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  href: string;
}

function SidebarItem({ icon, label, href }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/') && href !== '/super-admin/dashboard';
  
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 font-medium rounded-xl transition-colors ${
        isActive ? 'text-blue-700 bg-blue-50' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function SidebarGroup({ icon, label, children, activePathMatcher }: { icon: ReactNode, label: string, children: ReactNode, activePathMatcher: string }) {
  const pathname = usePathname();
  const isActiveGroup = pathname.includes(activePathMatcher);
  const [isOpen, setIsOpen] = useState(isActiveGroup);
  
  useEffect(() => {
    if (isActiveGroup) setIsOpen(true);
  }, [isActiveGroup]);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 font-medium rounded-xl transition-colors ${
          isActiveGroup && !isOpen ? 'text-blue-700 bg-blue-50/50' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
        }`}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span>{label}</span>
        </div>
        {isOpen ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
      </button>
      {isOpen && (
        <div className="pl-11 mt-1 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
}

function SidebarSubItem({ label, href, icon }: { label: string, href: string, icon?: ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/');
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        isActive ? 'text-blue-700 bg-blue-50' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50/50'
      }`}
    >
      {icon && <span className="opacity-70">{icon}</span>}
      <span>{label}</span>
    </Link>
  );
}

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex bg-gray-50 h-screen w-full font-sans text-gray-900 overflow-hidden">
      
      {/* Sidebar for Desktop */}
      <aside className="w-64 bg-white border-r border-gray-100 flex-col justify-between hidden md:flex shadow-sm z-10 overflow-y-auto">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-gray-100">
            <h1 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">
              Meys
            </h1>
            <span className="ml-2 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 py-0.5 px-2 rounded-md">
              M-T
            </span>
          </div>

          <nav className="p-4 space-y-1.5">
            <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" href="/super-admin/dashboard" />
            <SidebarItem icon={<Building2 size={20} />} label="Empresas (Tenants)" href="/super-admin/companies" />
            
            <SidebarGroup icon={<Settings size={20} />} label="Configuración" activePathMatcher="/super-admin/settings">
              <SidebarSubItem 
                label="Usuarios" 
                href="/super-admin/settings/users" 
                icon={<Users size={16} />} 
              />
            </SidebarGroup>
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50 mt-auto">
          <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-white border border-gray-200 shadow-sm">
            <div className="bg-blue-100 p-2 rounded-full text-blue-700">
              <UserIcon size={16} strokeWidth={2.5}/>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate">{user?.email || '...'}</p>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Root / Global</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 bg-red-50 hover:bg-red-100 font-semibold rounded-xl transition-colors"
          >
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 bg-white border-b border-gray-100 shadow-sm flex items-center justify-between px-6 md:hidden z-10">
          <h1 className="text-lg font-extrabold text-blue-700">Meys</h1>
          <button onClick={handleLogout} className="text-sm font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
            Salir
          </button>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50">
          {children}
        </main>
      </div>

    </div>
  );
}
