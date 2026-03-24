import { UsersService } from './users.service';
import { CreateSuperAdminDto } from './dto/create-user.dto';
import { UpdateSuperAdminDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(req: any, createSuperAdminDto: CreateSuperAdminDto): Promise<any>;
    findAll(): Promise<any[]>;
    findDeleted(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(req: any, id: string, updateSuperAdminDto: UpdateSuperAdminDto): Promise<any>;
    toggleStatus(req: any, id: string): Promise<any>;
    restore(req: any, id: string): Promise<any>;
    remove(req: any, id: string): Promise<any>;
}
