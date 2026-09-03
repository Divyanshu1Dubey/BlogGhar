import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const [emailArg, password] = process.argv.slice(2);
  const email = emailArg?.trim().toLowerCase();

  if (!email || !password || !email.includes('@') || password.length < 8) {
    throw new Error('Usage: npm run admin:create -- <email> <password> (password must be at least 8 characters)');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.upsert({
    where: { email },
    update: { role: 'ADMIN', password: passwordHash },
    create: { email, password: passwordHash, role: 'ADMIN', name: email.split('@')[0] },
    select: { email: true, role: true },
  });

  console.log(`Admin account ready: ${user.email} (${user.role})`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
