'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  UserPlus
} from 'lucide-react';
import { signOut } from 'next-auth/react';

interface ResponsibleLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { href: '/dashboard/responsible', icon: LayoutDashboard, label: 'Visão Geral' },
  { href: '/dashboard/responsible/teens', icon: Users, label: 'Meus Teens' },
  { href: '/dashboard/responsible/vincular', icon: UserPlus, label: 'Vincular Teen' },
  { href: '/dashboard/mensagens', icon: MessageSquare, label: 'Mensagens' },
  { href: '/dashboard/configuracoes', icon: Settings, label: 'Configurações' },
];

export function ResponsibleLayout({ children }: ResponsibleLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r min-h-screen">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-green-600">Dindin Teens</h1>
          <p className="text-sm text-gray-600 mt-1">Painel do Responsável</p>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-green-50 text-green-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t bg-white">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
