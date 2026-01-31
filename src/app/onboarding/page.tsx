"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, Target, Wallet, User, ShieldCheck } from "lucide-react";
import { saveTeenProfile } from "../actions/saveProfile";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const [formData, setFormData] = useState({
    age: "",
    incomeSource: "NENHUM",
    monthlyIncome: "",
    mainGoal: "",
    riskProfile: "MODERADO",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalSteps = 4;

  const nextStep = () => {
    if (step === 1 && !formData.age) {
      setError("Por favor, digite sua idade");
      return;
    }
    if (step === 3 && !formData.mainGoal) {
      setError("Por favor, descreva seu objetivo");
      return;
    }
    setError("");
    setStep((s) => Math.min(s + 1, totalSteps));
  };

  const prevStep = () => {
    setError("");
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await saveTeenProfile({
        age: parseInt(formData.age),
        incomeSource: formData.incomeSource,
        monthlyIncome: parseFloat(formData.monthlyIncome) || 0,
        mainGoal: formData.mainGoal,
        riskProfile: formData.riskProfile,
      });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Erro ao salvar perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      {/* Barra de Progresso */}
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between mb-2 text-sm text-slate-400">
          <span>Passo {step} de {totalSteps}</span>
          <span>{Math.round((step / totalSteps) * 100)}%</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <div className="w-full max-w-md bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700">
        {/* Passo 1: Dados Básicos */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <User className="text-blue-400" />
              <h2 className="text-2xl font-bold">Quem é você?</h2>
            </div>
            <p className="text-slate-400">Para começar, qual a sua idade?</p>
            <input
              type="number"
              placeholder="Ex: 16"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              min="10"
              max="25"
            />
          </div>
        )}

        {/* Passo 2: Renda */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="text-green-400" />
              <h2 className="text-2xl font-bold">Sua Grana</h2>
            </div>
            <p className="text-slate-400">De onde vem seu dinheiro?</p>
            <select
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 outline-none focus:ring-2 focus:ring-green-500"
              value={formData.incomeSource}
              onChange={(e) => setFormData({ ...formData, incomeSource: e.target.value })}
            >
              <option value="NENHUM">Não tenho renda ainda</option>
              <option value="MESADA">Mesada</option>
              <option value="TRABALHO">Trabalho / Estágio</option>
              <option value="FREELANCE">Freelance / Bicos</option>
            </select>
            <input
              type="number"
              placeholder="Quanto você recebe por mês? (R$)"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 outline-none focus:ring-2 focus:ring-green-500"
              value={formData.monthlyIncome}
              onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
              min="0"
            />
          </div>
        )}

        {/* Passo 3: Objetivo */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="text-red-400" />
              <h2 className="text-2xl font-bold">Seu Sonho</h2>
            </div>
            <p className="text-slate-400">Qual seu maior objetivo financeiro hoje?</p>
            <textarea
              placeholder="Ex: Comprar um PC Gamer, viajar com amigos, começar a investir..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 h-32 outline-none focus:ring-2 focus:ring-red-500"
              value={formData.mainGoal}
              onChange={(e) => setFormData({ ...formData, mainGoal: e.target.value })}
            />
          </div>
        )}

        {/* Passo 4: Perfil de Risco */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="text-purple-400" />
              <h2 className="text-2xl font-bold">Seu Perfil</h2>
            </div>
            <p className="text-slate-400">Como você lida com riscos e perdas?</p>
            <div className="grid grid-cols-1 gap-3">
              {[
                { value: 'CONSERVADOR', label: 'Conservador', desc: 'Prefiro segurança' },
                { value: 'MODERADO', label: 'Moderado', desc: 'Equilíbrio é tudo' },
                { value: 'ARROJADO', label: 'Arrojado', desc: 'Vou de tudo!' }
              ].map((profile) => (
                <button
                  key={profile.value}
                  onClick={() => setFormData({ ...formData, riskProfile: profile.value })}
                  className={`p-4 rounded-lg border transition-all text-left ${
                    formData.riskProfile === profile.value 
                    ? 'border-purple-500 bg-purple-500/10 text-purple-400' 
                    : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div className="font-bold">{profile.label}</div>
                  <div className="text-sm">{profile.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mensagem de Erro */}
        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Navegação */}
        <div className="flex justify-between mt-10">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className={`flex items-center gap-2 text-slate-400 hover:text-white transition-colors ${step === 1 ? 'invisible' : ''}`}
          >
            <ChevronLeft size={20} /> Voltar
          </button>
          
          {step < totalSteps ? (
            <button
              onClick={nextStep}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all"
            >
              Próximo <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-bold transition-all disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Finalizar Perfil"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
