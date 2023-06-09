import { UpdateUsersDto } from '../dto/user.dto';
import { UserRepository, IUser } from '../model/user.model';
import { setError } from '../utils/error-format';
import { autoInjectable, container } from 'tsyringe';
import { CreateUsersDto, GetUsersDto } from '../dto/user.dto';
import { IProfileServices, ProfileServices } from './profile.services';


export interface IUserServices {
    findUsers(query: GetUsersDto): Promise<{ count: number, users: IUser[] }>;
    findUser(id: number | Partial<IUser>): Promise<IUser>;
    findOne(data: Partial<IUser>): Promise<IUser>;
    create(createUsersDto: CreateUsersDto): Promise<IUser>;
    isExist(data: Partial<IUser>): Promise<boolean>;
    update(updateUsersDto: UpdateUsersDto): Promise<IUser>;
    delete(id: number): Promise<void>
}


@autoInjectable()
export class UserServices implements IUserServices {
    private readonly userRepo: UserRepository;

    constructor(
        userRepo: UserRepository,
    ) {
        this.userRepo = userRepo;
    }

    userQueryServices() {
        return this.userRepo.qb()
    }

    async findUsers(query: GetUsersDto): Promise<{ count: number, users: IUser[] }> {
        try {
            return await this.userRepo.find({}, query)
        } catch (error) {
            throw error
        }
    }


    async findUser(id: number | Partial<IUser>) {
        try {
            return await this.userQueryServices()
                .where(id)
                .first();
        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }

    async findOne(data: Partial<IUser>) {
        try {
            return await this.userRepo.findOne(data);
        } catch (error) {
            throw error
        }
    }

    async isExist(data: Partial<IUser>) {
        try {
            return await this.userRepo.isExist(data);
        } catch (error) {
            throw error;
        }
    }

    async create(createUsersDto: CreateUsersDto) {
        try {
            return await this.userRepo.create(createUsersDto);
        } catch (error) {
            throw error;
        }
    }

    async update(updateUsersDto: UpdateUsersDto) {

        const { userId, ...others } = updateUsersDto;
        try {
            let user = await this.findUser({ username: updateUsersDto?.username || '' });

            if (user && user.id !== updateUsersDto.userId) throw setError(400, "username is already used")

            user = await this.findUser({ email: updateUsersDto?.email || '' });

            if (user && user.id !== updateUsersDto.userId) throw setError(400, "email is already used")

            return await this.userRepo.update(updateUsersDto.userId, others);

        } catch (error) {
            throw error
        }
    }

    async delete(id: number) {
        try {
            await this.userRepo.delete(id)
        } catch (error) {
            throw error
        }
    }
}


container.register("IUserServices", { useClass: UserServices });


const userService = container.resolve(UserServices);

export default userService;