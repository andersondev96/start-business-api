-- AlterTable
ALTER TABLE "addresses" ALTER COLUMN "cep" DROP NOT NULL,
ALTER COLUMN "cep" SET DEFAULT '',
ALTER COLUMN "street" DROP NOT NULL,
ALTER COLUMN "street" SET DEFAULT '',
ALTER COLUMN "district" DROP NOT NULL,
ALTER COLUMN "district" SET DEFAULT '',
ALTER COLUMN "number" DROP NOT NULL;
