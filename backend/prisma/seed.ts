import { PrismaClient, Role } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL || 'postgresql://luis@localhost:5432/meys?schema=public';
const pool: any = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- Iniciando Seeding Meys ---');

  const superAdminEmail = 'admin@meys.com';
  // Recomendación: configurar SUPER_ADMIN_PASSWORD en el .env de producción
  const password = process.env.SUPER_ADMIN_PASSWORD || 'Meys123!';
  const saltOrRounds = 10;
  const hash = await bcrypt.hash(password, saltOrRounds);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: superAdminEmail },
  });

  if (!existingAdmin) {
    const superAdmin = await prisma.user.upsert({
      where: { email: superAdminEmail },
      update: {},
      create: {
        email: superAdminEmail,
        passwordHash: hash,
        role: Role.SUPER_ADMIN,
        firstName: 'Global',
        lastName: 'Super Admin',
        isActive: true,
        // Al ser SUPER_ADMIN el tenant es null a nivel global
        companyId: null,
      },
    });
    console.log(`✅ Super Admin global creado: ${superAdmin.email}`);
  } else {
    console.log('⚠️ El Super Admin ya existe. Omitiendo la creación...');
  }
}

main()
  .catch((e) => {
    console.error('Error durante el seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('--- Seeding Finalizado ---');
  });
