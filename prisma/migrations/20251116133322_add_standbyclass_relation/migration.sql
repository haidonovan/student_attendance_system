-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_standbyClassId_fkey" FOREIGN KEY ("standbyClassId") REFERENCES "StandbyClass"("id") ON DELETE SET NULL ON UPDATE CASCADE;
