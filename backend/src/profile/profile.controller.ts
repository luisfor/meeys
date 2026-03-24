import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('profile')
// Protegemos globalmente todas las rutas de este controlador con JWT y Roles
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  // Accesible por cualquier usuario que esté logueado válidamente
  async getMyProfile(@Request() req: any) {
    const userId = req.user.id;
    return this.profileService.getProfile(userId);
  }

  @Get('superadmin-only')
  // Esta ruta usa el Guard para verificar el Rol estrictamente
  @Roles(Role.SUPER_ADMIN)
  async getSuperAdminSecretData() {
    return {
      message: 'Autorizado: Esta data global solo puede ser vista por el Super Admin.',
    };
  }
}
