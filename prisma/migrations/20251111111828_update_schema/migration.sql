/*
  Warnings:

  - A unique constraint covering the columns `[employeeId]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Teacher" ADD COLUMN     "employeeId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_employeeId_key" ON "Teacher"("employeeId");
