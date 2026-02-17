/*
  Warnings:

  - You are about to drop the column `favorites` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "favorites";

-- CreateTable
CREATE TABLE "FavoriteCompany" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteService" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteService_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteCompany_user_id_company_id_key" ON "FavoriteCompany"("user_id", "company_id");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteService_user_id_service_id_key" ON "FavoriteService"("user_id", "service_id");

-- AddForeignKey
ALTER TABLE "FavoriteCompany" ADD CONSTRAINT "FavoriteCompany_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteCompany" ADD CONSTRAINT "FavoriteCompany_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteService" ADD CONSTRAINT "FavoriteService_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteService" ADD CONSTRAINT "FavoriteService_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
