import { PrismaService } from '../prisma/prisma.service';
export declare class ProfileService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
        email: string;
        id: string;
        firstName: string;
        lastName: string;
        photoUrl: string | null;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
        companyId: string | null;
        createdAt: Date;
    }>;
}
