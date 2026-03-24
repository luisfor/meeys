import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';
// Permite definir qué roles pueden entrar a un endpoint específico
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
