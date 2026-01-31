"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function saveTeenProfile(data: {
  age: number;
  incomeSource: string;
  monthlyIncome: number;
  mainGoal: string;
  riskProfile: string;
}) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      throw new Error("Não autenticado");
    }

    const userId = (session.user as any).id;

    const profile = await prisma.teenProfile.upsert({
      where: { userId },
      update: {
        age: data.age,
        incomeSource: data.incomeSource as any,
        monthlyIncome: data.monthlyIncome,
        mainGoal: data.mainGoal,
        riskProfile: data.riskProfile as any,
      },
      create: {
        userId,
        age: data.age,
        incomeSource: data.incomeSource as any,
        monthlyIncome: data.monthlyIncome,
        mainGoal: data.mainGoal,
        riskProfile: data.riskProfile as any,
      },
    });

    await prisma.userProgress.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        xp: 0,
        level: 1,
      },
    });

    return { ok: true, profile };
  } catch (error: any) {
    throw new Error(error.message || "Erro ao salvar perfil");
  }
}
