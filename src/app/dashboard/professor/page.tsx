'use client';

import { useEffect, useState } from 'react';
import { ProfessorLayout } from '@/components/layout/ProfessorLayout';
import {
  Users,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  Activity
} from 'lucide-react';

export default function ProfessorDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [classesRes] = await Promise.all([
        fetch('/api/professor/classes'),
      ]);

      const classesData = await classesRes.json();

      if (classesData.data) {
        setClasses(classesData.data);
        
        // Calcular estatísticas
        const totalTeens = classesData.data.reduce((acc: number, c: any) => acc + c.totalTeens, 0);
        const avgISJF = classesData.data
          .filter((c: any) => c.avgISJF !== null)
          .reduce((acc: number, c: any, idx: number, arr: any[]) => acc + c.avgISJF / arr.length, 0);

        setStats({
          totalClasses: classesData.data.length,
          totalTeens,
          avgISJF: avgISJF || 0
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfessorLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Visão Geral</h1>
        <p className="text-gray-600 mb-8">Acompanhe o progresso das suas turmas</p>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl border">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stats?.totalClasses || 0}</h3>
                <p className="text-gray-600">Turmas</p>
              </div>

              <div className="bg-white p-6 rounded-xl border">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stats?.totalTeens || 0}</h3>
                <p className="text-gray-600">Alunos</p>
              </div>

              <div className="bg-white p-6 rounded-xl border">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Activity className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {stats?.avgISJF ? stats.avgISJF.toFixed(0) : 'N/A'}
                </h3>
                <p className="text-gray-600">ISJF Médio</p>
              </div>
            </div>

            {/* Turmas */}
            <div className="bg-white rounded-xl border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Minhas Turmas</h2>
              
              {classes.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Você ainda não está vinculado a nenhuma turma.</p>
              ) : (
                <div className="space-y-4">
                  {classes.map((classItem: any) => (
                    <div
                      key={classItem.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{classItem.class.nome}</h3>
                          <p className="text-sm text-gray-600">
                            {classItem.class.institution?.nome || 'Sem instituição'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">{classItem.totalTeens}</p>
                          <p className="text-sm text-gray-600">alunos</p>
                        </div>
                      </div>
                      {classItem.avgISJF !== null && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">ISJF Médio:</span>
                            <span className="font-semibold text-gray-900">
                              {classItem.avgISJF.toFixed(0)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </ProfessorLayout>
  );
}
