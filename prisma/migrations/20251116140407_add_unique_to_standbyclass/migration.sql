/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `StandbyClass` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StandbyClass_name_key" ON "StandbyClass"("name");
