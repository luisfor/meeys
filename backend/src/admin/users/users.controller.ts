import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateSuperAdminDto } from './dto/create-user.dto';
import { UpdateSuperAdminDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN)
@Controller('admin/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Request() req: any, @Body() createSuperAdminDto: CreateSuperAdminDto) {
    return this.usersService.create(req.user.id, createSuperAdminDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('deleted')
  findDeleted() {
    return this.usersService.findDeleted();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() updateSuperAdminDto: UpdateSuperAdminDto) {
    return this.usersService.update(req.user.id, id, updateSuperAdminDto);
  }

  @Patch(':id/toggle')
  toggleStatus(@Request() req: any, @Param('id') id: string) {
    return this.usersService.toggleStatus(req.user.id, id);
  }

  @Patch(':id/restore')
  restore(@Request() req: any, @Param('id') id: string) {
    return this.usersService.restore(req.user.id, id);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.usersService.remove(req.user.id, id);
  }
}
