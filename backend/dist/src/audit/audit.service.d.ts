import { PrismaService } from '../prisma/prisma.service';
export declare class AuditService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    logAction(userId: string, action: string, entity: string, entityId: string, oldValues?: any, newValues?: any): Promise<void>;
}
