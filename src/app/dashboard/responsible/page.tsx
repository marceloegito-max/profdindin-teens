'use client';

import { useEffect, useState } from 'react';
import { ResponsibleLayout } from '@/components/layout/ResponsibleLayout';
import { Users, TrendingUp, Award, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function ResponsibleDashboard() {
  const [teens, setTeens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeens();
  }, []);

  const fetchTeens = async () => {
    try {
      const res = await fetch('/api/responsible/teens');
      const data = await res.json();
      if (data.data) {
        setTeens(data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar teens:', error);
    } finally {
      setLoading(false);
    }
  };

  const getISJFColor = (isjf: number | null) => {
    if (!isjf) return 'text-gray-500';
    if (isjf >= 700) return 'text-green-600';
    if (isjf >= 400) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <ResponsibleLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Visão Geral</h1>
        <p className="text-gray-600 mb-8">Acompanhe o progresso dos seus teens</p>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <>
            {teens.length === 0 ? (
              <div className="bg-white rounded-xl border p-8 text-center">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum teen vinculado
                </h3>
                <p className="text-gray-600 mb-6">
                  Você ainda não tem teens vinculados à sua conta.
                </p>
                <Link
                  href="/dashboard/responsible/vincular"
                  className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Vincular Teen
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teens.map((teen: any) => (
                  <div key={teen.id} className="bg-white rounded-xl border p-6">
                    <div className="flex items-start gap-4 mb-4">
                      {teen.image ? (
                        <img
                          src={teen.image}
                          alt={teen.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                          {teen.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">{teen.name}</h3>
                        <p className="text-sm text-gray-600">{teen.email}</p>
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded mt-1">
                          {teen.relacao}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-6">
                      <div className="text-center">
                        <div className="p-3 bg-blue-50 rounded-lg mb-2 inline-block">
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                        </div>
                        <p className={`text-2xl font-bold ${
                          getISJFColor(teen.latestISJF?.indiceISJF || null)
                        }`}>
                          {teen.latestISJF?.indiceISJF?.toFixed(0) || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-600">ISJF</p>
                      </div>

                      <div className="text-center">
                        <div className="p-3 bg-purple-50 rounded-lg mb-2 inline-block">
                          <Award className="h-5 w-5 text-purple-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          {teen.userProgress?.xp || 0}
                        </p>
                        <p className="text-xs text-gray-600">XP</p>
                      </div>

                      <div className="text-center">
                        <div className="p-3 bg-green-50 rounded-lg mb-2 inline-block">
                          <Calendar className="h-5 w-5 text-green-600" />
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          {teen.totalActivities || 0}
                        </p>
                        <p className="text-xs text-gray-600">Atividades</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t">
                      <Link
                        href={`/dashboard/responsible/teens/${teen.id}`}
                        className="block text-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </ResponsibleLayout>
  );
}
