const { PrismaClient } = require('../lib/generated/prisma');
const prisma = new PrismaClient();

// Utility to pause for a certain time
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Wrapped delete logic with retry
async function tryDelete(fn, name, maxRetries = 10, delay = 2000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await fn();
      console.log(`✅ Cleared: ${name}`);
      return;
    } catch (error) {
      console.warn(`⚠️ Attempt ${attempt} failed on ${name}: ${error.message}`);
      if (attempt < maxRetries) {
        console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
        await wait(delay);
      } else {
        throw new Error(`❌ Failed to delete ${name} after ${maxRetries} attempts.`);
      }
    }
  }
}

async function main() {
  console.log("🚨 Starting full database wipe with retry...");

  // Start deleting from lowest-dependency tables upward
  await tryDelete(() => prisma.attendance.deleteMany({}), "Attendance");
  await tryDelete(() => prisma.report.deleteMany({}), "Report");
  await tryDelete(() => prisma.notification.deleteMany({}), "Notification");
  await tryDelete(() => prisma.student.deleteMany({}), "Student");
  await tryDelete(() => prisma.teacher.deleteMany({}), "Teacher");
  await tryDelete(() => prisma.class.deleteMany({}), "Class");
  await tryDelete(() => prisma.session.deleteMany({}), "Session");
  await tryDelete(() => prisma.account.deleteMany({}), "Account");
  await tryDelete(() => prisma.user.deleteMany({}), "User");
  await tryDelete(() => prisma.sword.deleteMany({}), "Sword");

  console.log("🎉 All tables wiped clean.");
}

main()
  .catch((e) => {
    console.error("❌ Final error clearing database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
