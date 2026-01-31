import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function mean(nums: number[]) {
  if (!nums.length) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function clamp(n: number, min = 0, max = 125) {
  return Math.max(min, Math.min(max, n));
}

/**
 * IER = 125 - ((GI*GD*FRG)/10)
 * IRB360 = (GI*GD*FRG)*5
 */
function calcIER(gi: number, gd: number, frg: number) {
  return clamp(125 - (gi * gd * frg) / 10);
}

function calcIRB360(gi: number, gd: number, frg: number) {
  return gi * gd * frg * 5;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const userId = body?.userId as string | undefined;

    if (!userId) {
      return NextResponse.json(
        { error: "userId é obrigatório" },
        { status: 400 }
      );
    }

    // Busca avaliações + objetivo para saber o determinante
    const assessments = await prisma.controlAssessment.findMany({
      where: { userId },
      include: { objective: true },
    });

    if (!assessments.length) {
      return NextResponse.json(
        { error: "Nenhuma avaliação encontrada para este usuário." },
        { status: 404 }
      );
    }

    // Recalcula IER/IRB360 (e opcionalmente atualiza no banco)
    const enriched = assessments.map((a) => {
      const ier = calcIER(a.gi, a.gd, a.frg);
      const irb360 = calcIRB360(a.gi, a.gd, a.frg);
      return { ...a, ier, irb360 };
    });

    // Agrupar por determinante (GAR, HAB, REC, RI)
    const byDet = {
      GAR: enriched.filter((a) => a.objective.determinant === "GAR").map((a) => a.ier),
      HAB: enriched.filter((a) => a.objective.determinant === "HAB").map((a) => a.ier),
      REC: enriched.filter((a) => a.objective.determinant === "REC").map((a) => a.ier),
      RI: enriched.filter((a) => a.objective.determinant === "RI").map((a) => a.ier),
    };

    const gar = mean(byDet.GAR);
    const hab = mean(byDet.HAB);
    const rec = mean(byDet.REC);
    const ri = mean(byDet.RI);

    // ISJF final (média simples dos 4 determinantes)
    const isjfValue = mean([gar, hab, rec, ri]);

    // (Opcional) salvar valores recalculados em ControlAssessment
    // Se você quiser manter sempre coerente, faça updateMany individual
    await prisma.$transaction(
      enriched.map((a) =>
        prisma.controlAssessment.update({
          where: { id: a.id },
          data: { ier: a.ier, irb360: a.irb360 },
        })
      )
    );

    // Salvar histórico ISJF
    const history = await prisma.iSJFHistory.create({
      data: {
        userId,
        isjfValue,
        gar,
        hab,
        rec,
        ri,

        // Campos extras no schema (op/util/m1..m4) — se ainda não usa, salva 0
        op: 0,
        util: 0,
        m1: 0,
        m2: 0,
        m3: 0,
        m4: 0,
      },
    });

    return NextResponse.json({
      userId,
      isjfValue,
      determinants: { gar, hab, rec, ri },
      historyId: history.id,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao calcular ISJF", details: String(err?.message ?? err) },
      { status: 500 }
    );
  }
}
