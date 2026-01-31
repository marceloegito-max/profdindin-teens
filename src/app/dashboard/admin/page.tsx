'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  GraduationCap,
  Building2,
  Activity,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // TODO: Implementar API de estatísticas do admin
      // Por enquanto, valores mockados
      setStats({
        totalUsers: 0,
        totalInstitutions: 0,
        totalClasses: 0,
        avgISJF: 0
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Painel Administrativo</h1>
        <p className="text-gray-600 mb-8">Visão geral do sistema</p>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl border">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</h3>
                <p className="text-gray-600">Usuários</p>
              </div>

              <div className="bg-white p-6 rounded-xl border">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Building2 className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stats?.totalInstitutions || 0}</h3>
                <p className="text-gray-600">Instituições</p>
              </div>

              <div className="bg-white p-6 rounded-xl border">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stats?.totalClasses || 0}</h3>
                <p className="text-gray-600">Turmas</p>
              </div>

              <div className="bg-white p-6 rounded-xl border">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <Activity className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {stats?.avgISJF ? stats.avgISJF.toFixed(0) : 'N/A'}
                </h3>
                <p className="text-gray-600">ISJF Médio</p>
              </div>
            </div>

            {/* Alerta de Funcionalidades Pendentes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-2">
                    Funcionalidades em Desenvolvimento
                  </h3>
                  <p className="text-yellow-800 text-sm">
                    O painel administrativo completo está em desenvolvimento. Em breve você poderá:
                  </p>
                  <ul className="list-disc list-inside text-yellow-800 text-sm mt-2 space-y-1">
                    <li>Gerenciar instituições e turmas</li>
                    <li>Criar e gerenciar usuários</li>
                    <li>Visualizar relatórios analíticos</li>
                    <li>Moderar mensagens</li>
                    <li>Configurar o sistema</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
