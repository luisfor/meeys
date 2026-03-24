import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.user.updateMany({
    where: { email: 'admin@meys.com' },
    data: { deletedAt: null, isActive: true }
  });
  console.log("Admin restaurado correctamente.");
}
main().finally(() => prisma.$disconnect());
