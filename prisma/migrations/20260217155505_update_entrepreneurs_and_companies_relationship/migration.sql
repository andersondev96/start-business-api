/*
  Warnings:

  - You are about to drop the column `contact_id` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `services` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `entrepreneurs` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[entrepreneur_id]` on the table `companies` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[company_id]` on the table `contacts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `entrepreneur_id` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_id` to the `contacts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'ENTREPRENEUR', 'CUSTOMER');

-- DropForeignKey
ALTER TABLE "companies" DROP CONSTRAINT "companies_contact_id_fkey";

-- DropForeignKey
ALTER TABLE "companies" DROP CONSTRAINT "companies_user_id_fkey";

-- DropForeignKey
ALTER TABLE "entrepreneurs" DROP CONSTRAINT "entrepreneurs_company_id_fkey";

-- DropIndex
DROP INDEX "companies_contact_id_key";

-- DropIndex
DROP INDEX "companies_user_id_key";

-- DropIndex
DROP INDEX "entrepreneurs_company_id_key";

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "contact_id",
DROP COLUMN "services",
DROP COLUMN "user_id",
ADD COLUMN     "entrepreneur_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "contacts" ADD COLUMN     "company_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "entrepreneurs" DROP COLUMN "company_id";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CUSTOMER';

-- CreateIndex
CREATE UNIQUE INDEX "companies_entrepreneur_id_key" ON "companies"("entrepreneur_id");

-- CreateIndex
CREATE UNIQUE INDEX "contacts_company_id_key" ON "contacts"("company_id");

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_entrepreneur_id_fkey" FOREIGN KEY ("entrepreneur_id") REFERENCES "entrepreneurs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
