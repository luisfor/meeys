import { ProfileService } from './profile.service';
export declare class ProfileController {
    private readonly profileService;
    constructor(profileService: ProfileService);
    getMyProfile(req: any): Promise<{
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
    getSuperAdminSecretData(): Promise<{
        message: string;
    }>;
}
