-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('TEEN', 'ADMIN');
CREATE TYPE "IncomeSource" AS ENUM ('MESADA', 'TRABALHO', 'FREELANCE', 'NENHUM');
CREATE TYPE "Archetype" AS ENUM ('GASTADOR', 'POUPADOR', 'INVESTIDOR', 'EQUILIBRADO');
CREATE TYPE "RiskProfile" AS ENUM ('CONSERVADOR', 'MODERADO', 'ARROJADO');
CREATE TYPE "ActivityModule" AS ENUM ('CHECKUP', 'RAIO_X', 'MAPA_TESOURO');
CREATE TYPE "CoreDrive" AS ENUM ('EPIC_MEANING', 'DEVELOPMENT', 'EMPOWERMENT', 'OWNERSHIP', 'SOCIAL_INFLUENCE', 'SCARCITY', 'UNPREDICTABILITY', 'AVOIDANCE');
CREATE TYPE "MissionType" AS ENUM ('COMPLETE_ACTIVITIES', 'EARN_XP', 'MAINTAIN_STREAK', 'UNLOCK_BADGES');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "passwordHash" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'TEEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "teen_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "age" INTEGER,
    "incomeSource" "IncomeSource",
    "monthlyIncome" DOUBLE PRECISION,
    "mainGoal" TEXT,
    "archetype" "Archetype",
    "riskProfile" "RiskProfile",
    "hasDebt" BOOLEAN NOT NULL DEFAULT false,
    "hasSavings" BOOLEAN NOT NULL DEFAULT false,
    "hasInvestments" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teen_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastActiveDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "badges" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "criteria" TEXT NOT NULL,
    "requiredValue" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_badges" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "earnedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_badges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "streaks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "streaks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "module" "ActivityModule" NOT NULL,
    "name" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "tasks" JSONB NOT NULL,
    "tools" JSONB NOT NULL,
    "successCriteria" JSONB NOT NULL,
    "referenceModels" JSONB NOT NULL,
    "impact" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "suggestedDuration" TEXT NOT NULL,
    "prerequisites" TEXT[],
    "coreDrives" "CoreDrive"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "completed_activities" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pointsEarned" INTEGER NOT NULL,
    "responses" JSONB,

    CONSTRAINT "completed_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stressor_agents" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stressor_agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stressor_assessments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stressorId" TEXT NOT NULL,
    "impactLevel" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stressor_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_missions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "MissionType" NOT NULL,
    "target" INTEGER NOT NULL,
    "reward" INTEGER NOT NULL,
    "icon" TEXT NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "completed_missions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rewardEarned" INTEGER NOT NULL,

    CONSTRAINT "completed_missions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "teen_profiles_userId_key" ON "teen_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_progress_userId_key" ON "user_progress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "badges_name_key" ON "badges"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_badges_userId_badgeId_key" ON "user_badges"("userId", "badgeId");

-- CreateIndex
CREATE UNIQUE INDEX "streaks_userId_date_key" ON "streaks"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "activities_code_key" ON "activities"("code");

-- CreateIndex
CREATE UNIQUE INDEX "completed_activities_userId_activityId_key" ON "completed_activities"("userId", "activityId");

-- CreateIndex
CREATE UNIQUE INDEX "stressor_agents_name_key" ON "stressor_agents"("name");

-- CreateIndex
CREATE UNIQUE INDEX "stressor_assessments_userId_stressorId_key" ON "stressor_assessments"("userId", "stressorId");

-- CreateIndex
CREATE UNIQUE INDEX "completed_missions_userId_missionId_key" ON "completed_missions"("userId", "missionId");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teen_profiles" ADD CONSTRAINT "teen_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "badges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "streaks" ADD CONSTRAINT "streaks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "completed_activities" ADD CONSTRAINT "completed_activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "completed_activities" ADD CONSTRAINT "completed_activities_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stressor_assessments" ADD CONSTRAINT "stressor_assessments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stressor_assessments" ADD CONSTRAINT "stressor_assessments_stressorId_fkey" FOREIGN KEY ("stressorId") REFERENCES "stressor_agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "completed_missions" ADD CONSTRAINT "completed_missions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "completed_missions" ADD CONSTRAINT "completed_missions_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "daily_missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
