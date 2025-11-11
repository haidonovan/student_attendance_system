/*
  Warnings:

  - You are about to drop the column `address` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `birthDate` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "standbyClassId" TEXT;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "address",
DROP COLUMN "birthDate",
ADD COLUMN     "standbyClassId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "phoneNumber" TEXT;

-- CreateTable
CREATE TABLE "StandbyClass" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "section" TEXT,
    "year" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StandbyClass_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_standbyClassId_fkey" FOREIGN KEY ("standbyClassId") REFERENCES "StandbyClass"("id") ON DELETE SET NULL ON UPDATE CASCADE;
