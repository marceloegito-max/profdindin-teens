"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus } from "lucide-react";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isSignup) {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });
        if (result?.ok) router.push("/onboarding");
      } else {
        const data = await res.json();
        setError(data.error || "Erro ao criar conta");
      }
    } else {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
      if (result?.ok) router.push("/onboarding");
      else setError("Email ou senha incorretos");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-700">
        <div className="flex items-center gap-3 mb-6">
          {isSignup ? <UserPlus className="text-green-400" /> : <LogIn className="text-blue-400" />}
          <h1 className="text-3xl font-bold">{isSignup ? "Criar Conta" : "Entrar"}</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <input
              type="text"
              placeholder="Seu nome"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 outline-none"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 outline-none"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 outline-none"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-lg font-bold transition-all disabled:opacity-50"
          >
            {loading ? "Processando..." : isSignup ? "Criar Conta" : "Entrar"}
          </button>
        </form>
        <button onClick={() => setIsSignup(!isSignup)} className="w-full mt-4 text-slate-400 hover:text-white text-sm">
          {isSignup ? "Já tem conta? Entrar" : "Não tem conta? Criar uma agora"}
        </button>
      </div>
    </div>
  );
}
