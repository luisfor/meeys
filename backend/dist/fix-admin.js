"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    await prisma.user.updateMany({
        where: { email: 'admin@meys.com' },
        data: { deletedAt: null, isActive: true }
    });
    console.log("Admin restaurado correctamente.");
}
main().finally(() => prisma.$disconnect());
//# sourceMappingURL=fix-admin.js.map