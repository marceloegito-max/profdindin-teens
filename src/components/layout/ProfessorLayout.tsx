'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileText,
  MessageSquare,
  Settings,
  LogOut
} from 'lucide-react';
import { signOut } from 'next-auth/react';

interface ProfessorLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { href: '/dashboard/professor', icon: LayoutDashboard, label: 'Visão Geral' },
  { href: '/dashboard/professor/turmas', icon: GraduationCap, label: 'Minhas Turmas' },
  { href: '/dashboard/professor/alunos', icon: Users, label: 'Alunos' },
  { href: '/dashboard/professor/relatorios', icon: FileText, label: 'Relatórios' },
  { href: '/dashboard/mensagens', icon: MessageSquare, label: 'Mensagens' },
  { href: '/dashboard/configuracoes', icon: Settings, label: 'Configurações' },
];

export function ProfessorLayout({ children }: ProfessorLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r min-h-screen">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">Professor Dindin</h1>
          <p className="text-sm text-gray-600 mt-1">Painel do Professor</p>
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
                        ? 'bg-blue-50 text-blue-600 font-medium'
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
