const { PrismaClient } = require('../lib/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const plainPassword = 'yourpassword123'; // change this
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = await prisma.user.upsert({
    where: { email: 'you@gmail.com' },
    update: {
      password: hashedPassword,  // update password if user exists
      name: 'taka shina',        // optionally update name as well
      role: 'STUDENT',            // ensure role is set correctly
    },
    create: {
      name: 'taka shina',
      email: 'you@gmail.com',
      password: hashedPassword,
      role: 'STUDENT',
    },
  });

  console.log('User created or updated:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());



//   User created or updated: {
//   id: 'cmdlpotev0000z95048g0hrkg',
//   name: 'taka shina',
//   email: 'you@gmail.com',
//   emailVerified: null,
//   image: null,
//   role: 'STUDENT',
//   password: '$2b$10$36OHvfqSvP5EVgiV62vw9eE/Uvf31cwsyUjDkaXArLDAsvtqoAtOe',
//   yourpassword123
//   createdAt: 2025-07-27T13:25:18.439Z,
//   updatedAt: 2025-07-30T00:51:58.266Z
// }