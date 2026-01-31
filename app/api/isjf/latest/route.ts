import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 });
  }

  const latest = await prisma.iSJFHistory.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (!latest) {
    return NextResponse.json(
      { error: "Nenhum histórico ISJF encontrado." },
      { status: 404 }
    );
  }

  return NextResponse.json(latest);
}
