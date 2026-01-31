'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Users, TrendingUp, Activity, Award, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/Skeleton';

interface Teen {
  id: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  isjfScore: number | null;
  activitiesCompleted: number;
}

interface ClassDetails {
  id: string;
  name: string;
  description: string | null;
  schoolYear: number;
  institution: {
    name: string;
  };
  teens: Teen[];
  _count: {
    teens: number;
  };
}

export default function TurmaDetalhesPage() {
  const params = useParams();
  const classId = params.id as string;
  const [classData, setClassData] = useState<ClassDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClassDetails();
  }, [classId]);

  const fetchClassDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/classes/${classId}`);
      if (response.ok) {
        const data = await response.json();
        setClassData(data);
      }
    } catch (error) {
      console.error('Erro ao carregar turma:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton height={40} width="40%" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} height={120} />
          ))}
        </div>
        <Skeleton height={400} />
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">Turma não encontrada</p>
      </div>
    );
  }

  const avgISJF = classData.teens.length > 0
    ? classData.teens.reduce((sum, t) => sum + (t.isjfScore || 0), 0) / classData.teens.length
    : 0;

  const totalActivities = classData.teens.reduce((sum, t) => sum + t.activitiesCompleted, 0);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/professor/turmas"
          className="bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {classData.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {classData.institution.name} • Ano {classData.schoolYear}
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full p-3">
              <Users className="text-blue-500" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total de Alunos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {classData._count.teens}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 dark:bg-green-900/20 rounded-full p-3">
              <TrendingUp className="text-green-500" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">ISJF Médio</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {avgISJF.toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 dark:bg-purple-900/20 rounded-full p-3">
              <Activity className="text-purple-500" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Atividades Concluídas</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalActivities}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Alunos */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Alunos da Turma
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ISJF Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Atividades
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {classData.teens.map((teen) => (
                <tr key={teen.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/20">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {teen.user.name || 'Sem nome'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {teen.user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {teen.isjfScore?.toFixed(1) || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Award className="text-yellow-500" size={16} />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {teen.activitiesCompleted}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/dashboard/professor/alunos/${teen.id}`}
                      className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                    >
                      Ver Detalhes
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {classData.teens.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              Nenhum aluno matriculado nesta turma ainda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
