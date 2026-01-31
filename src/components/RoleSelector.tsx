'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ChevronDown, GraduationCap, Users, Shield, User } from 'lucide-react';

export function RoleSelector() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  if (!session?.user) return null;

  const currentRole = (session.user as any).role;

  // TODO: Implementar lógica para detectar múltiplos roles
  // Por enquanto, assumimos que o usuário tem apenas um role
  const roles = [currentRole];

  // Se tiver apenas um role, não mostrar o selector
  if (roles.length <= 1) return null;

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'TEEN':
        return {
          label: 'Aluno',
          icon: User,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          path: '/dashboard'
        };
      case 'PROFESSOR':
        return {
          label: 'Professor',
          icon: GraduationCap,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          path: '/dashboard/professor'
        };
      case 'RESPONSIBLE':
        return {
          label: 'Responsável',
          icon: Users,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          path: '/dashboard/responsible'
        };
      case 'ADMIN':
        return {
          label: 'Admin',
          icon: Shield,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          path: '/dashboard/admin'
        };
      default:
        return {
          label: role,
          icon: User,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          path: '/dashboard'
        };
    }
  };

  const currentRoleInfo = getRoleInfo(currentRole);
  const CurrentIcon = currentRoleInfo.icon;

  const handleRoleSwitch = (role: string) => {
    const roleInfo = getRoleInfo(role);
    router.push(roleInfo.path);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${currentRoleInfo.bgColor} ${currentRoleInfo.color} font-medium transition-colors hover:opacity-80`}
      >
        <CurrentIcon className="h-5 w-5" />
        <span>{currentRoleInfo.label}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white border rounded-lg shadow-lg min-w-[200px] py-2 z-50">
          {roles.map((role) => {
            const roleInfo = getRoleInfo(role);
            const RoleIcon = roleInfo.icon;
            const isActive = role === currentRole;

            return (
              <button
                key={role}
                onClick={() => handleRoleSwitch(role)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                  isActive ? 'bg-gray-50' : ''
                }`}
              >
                <div className={`p-2 rounded-lg ${roleInfo.bgColor}`}>
                  <RoleIcon className={`h-4 w-4 ${roleInfo.color}`} />
                </div>
                <span className="font-medium text-gray-900">{roleInfo.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-blue-600" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
