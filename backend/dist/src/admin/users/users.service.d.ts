import { PrismaService } from '../../prisma/prisma.service';
import { CreateSuperAdminDto } from './dto/create-user.dto';
import { UpdateSuperAdminDto } from './dto/update-user.dto';
import { AuditService } from '../../audit/audit.service';
export declare class UsersService {
    private readonly prisma;
    private readonly auditService;
    constructor(prisma: PrismaService, auditService: AuditService);
    create(adminId: string, createDto: CreateSuperAdminDto): Promise<any>;
    findAll(): Promise<any[]>;
    findDeleted(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(adminId: string, id: string, updateDto: UpdateSuperAdminDto): Promise<any>;
    toggleStatus(adminId: string, id: string): Promise<any>;
    remove(adminId: string, id: string): Promise<any>;
    restore(adminId: string, id: string): Promise<any>;
    private excludePassword;
}
