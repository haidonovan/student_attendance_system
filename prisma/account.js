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
