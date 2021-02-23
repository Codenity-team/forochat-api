import { ForbiddenException, Injectable,
    InternalServerErrorException,
    NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from 'src/shared/enum/status.enum';
import { IResponseStructureReturn } from 'src/shared/interfaces/responsesReturn.interface';
import { BasicService } from 'src/shared/services/base.service';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './dto/createUserDTO.dto';
import { UserUniqueFieldsDto } from './dto/unique.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UsersService extends BasicService<User> {

    private relations = [];

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { 
        super(userRepository);
    }

    async create(data: CreateUserDTO, response: any): Promise<any> {
        // await this.validateUniqueFields(data, response);

        const newUser = await this.save(data)
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });
        
        return this.formatReturn(response.success, 'user', newUser);
    }

    async update(data: CreateUserDTO, id: number, response: any): Promise<any> {
        // await this.validateUniqueFields(data, response);

        const user = await this.createQueryBuilder()
        .update(User)
        .set(data)
        .where("id = :id", { id: id })
        .execute()
            .catch(() => {
                throw new InternalServerErrorException(response.error);
            });
        
        return this.formatReturn(response.success, 'user', user);
    }

    /**
     * function responsible for the validation of the fields that have to be unique in users
     * @param data unique fields for users
     * @param response response in case of error 
     */
    async validateUniqueFields(data: UserUniqueFieldsDto, response: any, id?: number):
        Promise<boolean> {

        let query = this.userRepository.createQueryBuilder('u');

        if (id) {
            query = query.andWhere('u.id <> :id', { id });
        }

        if (data.identification) {
            query = query.andWhere('(u.identification iLIKE :doc', { doc: data.identification })
                .andWhere('u.status <> :status', { status: Status.DELETED })
                .orWhere('u.mail iLIKE :email)', { email: data.email });
        } else {
            query = query.andWhere('(u.email iLIKE :email', { email: data.email })
                .andWhere('u.status <> :status)', { status: Status.DELETED });
        }

        const user = await query.getOne();

        if (!user) {
            return true;
        }

        if (data.email.toLowerCase() === user.email.toLocaleLowerCase()) {
            throw new NotAcceptableException(response.mailExists);
        }

        throw new NotAcceptableException(response.documentExists);
    }

    /**
     *  Find all Users
     *  @return Promise with all users.
     */
    async findAll(): Promise<User[]> {
        return this.createQueryBuilder()
            .where('status <> :status', { status: Status.DELETED })
            .getMany();
    }

     /**
     * Find User by id
     * 
     * @param id User id.
     */
    async findById(id: number, response: any): Promise<IResponseStructureReturn> {
        const user = await this.getUserByIdWithRelations(id, response.noPermission);

        return this.formatReturn(response.success, 'user', user);
    }

    /**
     * Get user by id with relations
     * @param id id to find
     * @param response Response in case of error with the structure
     */
    async getUserByIdWithRelations(id: number, response: any) {
        return await this.findOneOrFail(id,
            {
                where: `User.status <> '${Status.DELETED}'`,
                relations: this.relations
            })
            .catch(() => {
                throw new NotFoundException(response);
            });
    }

}
