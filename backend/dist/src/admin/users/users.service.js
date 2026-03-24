"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const client_1 = require("@prisma/client");
const audit_service_1 = require("../../audit/audit.service");
let UsersService = class UsersService {
    prisma;
    auditService;
    constructor(prisma, auditService) {
        this.prisma = prisma;
        this.auditService = auditService;
    }
    async create(adminId, createDto) {
        const existingUser = await this.prisma.user.findUnique({ where: { email: createDto.email } });
        if (existingUser) {
            throw new common_1.ConflictException('El correo electrónico ya está en uso.');
        }
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(createDto.password, saltOrRounds);
        const user = await this.prisma.user.create({
            data: {
                email: createDto.email,
                passwordHash: hash,
                role: client_1.Role.SUPER_ADMIN,
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
                role: client_1.Role.SUPER_ADMIN,
                deletedAt: null
            },
            orderBy: { createdAt: 'desc' }
        });
        return users.map(user => this.excludePassword(user));
    }
    async findDeleted() {
        const users = await this.prisma.user.findMany({
            where: {
                role: client_1.Role.SUPER_ADMIN,
                deletedAt: { not: null }
            },
            orderBy: { deletedAt: 'desc' }
        });
        return users.map(user => this.excludePassword(user));
    }
    async findOne(id) {
        const user = await this.prisma.user.findFirst({
            where: { id, role: client_1.Role.SUPER_ADMIN, deletedAt: null },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        return this.excludePassword(user);
    }
    async update(adminId, id, updateDto) {
        const oldUser = await this.findOne(id);
        if (updateDto.email) {
            const existingEmail = await this.prisma.user.findFirst({
                where: { email: updateDto.email, id: { not: id } }
            });
            if (existingEmail) {
                throw new common_1.ConflictException('El correo electrónico ya está en uso por otro usuario.');
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
    async toggleStatus(adminId, id) {
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
    async remove(adminId, id) {
        const oldUser = await this.findOne(id);
        const deletedUser = await this.prisma.user.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
        this.auditService.logAction(adminId, 'DELETE', 'SUPER_ADMIN', id, oldUser, deletedUser);
        return this.excludePassword(deletedUser);
    }
    async restore(adminId, id) {
        const oldUser = await this.prisma.user.findFirst({
            where: { id, role: client_1.Role.SUPER_ADMIN, deletedAt: { not: null } }
        });
        if (!oldUser) {
            throw new common_1.NotFoundException('Usuario no encontrado en la papelera de reciclaje');
        }
        const restoredUser = await this.prisma.user.update({
            where: { id },
            data: { deletedAt: null },
        });
        this.auditService.logAction(adminId, 'RESTORE', 'SUPER_ADMIN', id, oldUser, restoredUser);
        return this.excludePassword(restoredUser);
    }
    excludePassword(user) {
        const { passwordHash, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], UsersService);
//# sourceMappingURL=users.service.js.map