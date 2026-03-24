import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    // Retornamos el perfil excluyendo explícitamente el passwordHash por seguridad
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        companyId: true,
        firstName: true,
        lastName: true,
        photoUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Perfil no encontrado');
    }

    return user;
  }
}
