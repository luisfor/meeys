import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async logAction(
    userId: string,
    action: string,
    entity: string,
    entityId: string,
    oldValues?: any,
    newValues?: any,
  ) {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action,
          entity,
          entityId,
          oldValues: oldValues ? JSON.parse(JSON.stringify(oldValues)) : null,
          newValues: newValues ? JSON.parse(JSON.stringify(newValues)) : null,
        },
      });
    } catch (error: any) {
      this.logger.error(`Error saving audit log: ${error.message}`, error.stack);
      // Failsafe: Do not throw exception so the main REST transaction proceeds
    }
  }
}
