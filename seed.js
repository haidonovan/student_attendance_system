const { PrismaClient } = require('./lib/generated/prisma');
const prisma = new PrismaClient();

const MAX_RETRIES = 10;
const DELAY_MS = 2000; // 2 seconds between retries

const swordData = [
  { name: "Wooden Sword", material: "Wood", damage: 4 },
  { name: "Stone Sword", material: "Stone", damage: 5 },
  { name: "Iron Sword", material: "Iron", damage: 6 },
  { name: "Diamond Sword", material: "Diamond", damage: 7 },
  { name: "Netherite Sword", material: "Netherite", damage: 8 },
];

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function insertWithRetry(retries = 0) {
  try {
    await prisma.sword.createMany({ data: swordData });
    console.log("✅ Swords inserted!");
  } catch (err) {
    console.error(`❌ Attempt ${retries + 1} failed:`, err.message);

    if (retries < MAX_RETRIES) {
      console.log(`🔁 Retrying in ${DELAY_MS / 1000} seconds...`);
      await delay(DELAY_MS);
      return insertWithRetry(retries + 1);
    } else {
      console.error("❌ Max retries reached. Insert failed.");
      process.exit(1);
    }
  } finally {
    await prisma.$disconnect();
  }
}

insertWithRetry();
