const { PrismaClient } = require('../lib/generated/prisma'); // adjust path if needed
const prisma = new PrismaClient();

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function tryOperation(fn, name, maxRetries = 10, delay = 2000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn();
      console.log(`✅ Success: ${name}`);
      return result;
    } catch (error) {
      console.warn(`⚠️ Attempt ${attempt} failed on ${name}: ${error.message}`);
      if (attempt < maxRetries) {
        console.log(`⏳ Retrying ${name} in ${delay / 1000} seconds...`);
        await wait(delay);
      } else {
        throw new Error(`❌ Failed to complete ${name} after ${maxRetries} attempts.`);
      }
    }
  }
}

async function main() {
  // Create teacher user with profile
  const teacherUser = await tryOperation(() =>
    prisma.user.create({
      data: {
        name: "Ms. Hana",
        email: "hana.teacher@example.com",
        role: "TEACHER",
        teacherProfile: {
          create: {
            fullName: "Hana Suzuki",
            subject: "Biology",
            bio: "Passionate about life sciences and education.",
          },
        },
      },
    }),
    "Create Teacher User"
  );

  // Create class linked to teacher profile
  const biologyClass = await tryOperation(() =>
    prisma.class.create({
      data: {
        name: "Biology A",
        section: "A",
        year: 2025,
        teacher: {
          connect: { userId: teacherUser.id }
        },
      },
    }),
    "Create Biology Class"
  );

  // Create 24 students linked to this class
  for (let i = 1; i <= 24; i++) {
    await tryOperation(() =>
      prisma.user.create({
        data: {
          name: `Student ${i}`,
          email: `student${i}@example.com`,
          role: "STUDENT",
          studentProfile: {
            create: {
              fullName: `Student Number ${i}`,
              birthDate: new Date(2008, 0, i), // Jan 1-24, 2008
              studentId: `S${1000 + i}`,
              gender: i % 2 === 0 ? "Female" : "Male",
              classId: biologyClass.id,
            },
          },
        },
      }),
      `Create Student ${i}`
    );
  }

  console.log("🎉 Seed data created successfully!");
}

main()
  .catch(e => {
    console.error("❌ Seed script failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
