import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSuperAdminDto } from './dto/create-user.dto';
import { UpdateSuperAdminDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { AuditService } from '../../audit/audit.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(adminId: string, createDto: CreateSuperAdminDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: createDto.email } });
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está en uso.');
    }

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(createDto.password, saltOrRounds);

    const user = await this.prisma.user.create({
      data: {
        email: createDto.email,
        passwordHash: hash,
        role: Role.SUPER_ADMIN,
        firstName: createDto.firstName,
        lastName: createDto.lastName,
        phone: createDto.phone,
        documentNumber: createDto.documentNumber,
        photoUrl: createDto.photoUrl,
        companyId: null,
      },
    });
    
    this.auditService.logAction(adminId, 'CREATE', 'SUPER_ADMIN', user.id, null, user);
    
    return this.excludePassword(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      where: { 
        role: Role.SUPER_ADMIN,
        deletedAt: null 
      },
      orderBy: { createdAt: 'desc' }
    });
    return users.map(user => this.excludePassword(user));
  }

  async findDeleted() {
    const users = await this.prisma.user.findMany({
      where: { 
        role: Role.SUPER_ADMIN,
        deletedAt: { not: null } 
      },
      orderBy: { deletedAt: 'desc' }
    });
    return users.map(user => this.excludePassword(user));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, role: Role.SUPER_ADMIN, deletedAt: null },
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return this.excludePassword(user);
  }

  async update(adminId: string, id: string, updateDto: UpdateSuperAdminDto) {
    const oldUser = await this.findOne(id); // Verifica existencia

    if (updateDto.email) {
      const existingEmail = await this.prisma.user.findFirst({
        where: { email: updateDto.email, id: { not: id } }
      });
      if (existingEmail) {
        throw new ConflictException('El correo electrónico ya está en uso por otro usuario.');
      }
    }

    let updatedHash;
    if (updateDto.password) {
      updatedHash = await bcrypt.hash(updateDto.password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        email: updateDto.email,
        firstName: updateDto.firstName,
        lastName: updateDto.lastName,
        phone: updateDto.phone,
        documentNumber: updateDto.documentNumber,
        photoUrl: updateDto.photoUrl,
        ...(updatedHash && { passwordHash: updatedHash }),
      },
    });

    this.auditService.logAction(adminId, 'UPDATE', 'SUPER_ADMIN', id, oldUser, updatedUser);

    return this.excludePassword(updatedUser);
  }

  async toggleStatus(adminId: string, id: string) {
    const user = await this.findOne(id);
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        isActive: !user.isActive,
      },
    });
    
    this.auditService.logAction(adminId, 'TOGGLE', 'SUPER_ADMIN', id, user, updatedUser);
    
    return this.excludePassword(updatedUser);
  }

  async remove(adminId: string, id: string) {
    const oldUser = await this.findOne(id);
    const deletedUser = await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    
    this.auditService.logAction(adminId, 'DELETE', 'SUPER_ADMIN', id, oldUser, deletedUser);

    return this.excludePassword(deletedUser);
  }

  async restore(adminId: string, id: string) {
    const oldUser = await this.prisma.user.findFirst({
      where: { id, role: Role.SUPER_ADMIN, deletedAt: { not: null } }
    });
    if (!oldUser) {
      throw new NotFoundException('Usuario no encontrado en la papelera de reciclaje');
    }
    
    const restoredUser = await this.prisma.user.update({
      where: { id },
      data: { deletedAt: null },
    });
    
    this.auditService.logAction(adminId, 'RESTORE', 'SUPER_ADMIN', id, oldUser, restoredUser);
    
    return this.excludePassword(restoredUser);
  }

  private excludePassword(user: any) {
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
