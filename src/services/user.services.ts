import { UserRepository, IUser } from './../model/user.model';
import { Inject, Service } from "typedi";
import { setError } from '../utils/error-format';


@Service()
export default class UserServices {
    private readonly userRepo: UserRepository;

    constructor(
        @Inject() userRepo: UserRepository,
    ) {
        this.userRepo = userRepo;
    }

    userQueryServices() {
        return this.userRepo.qb()
    }

    async findUsers(query: any) {
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

    async create(data: Partial<IUser>) {
        try {
            return await this.userRepo.create(data);
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Partial<IUser>) {
        try {
            let user = await this.findUser({ username: data?.username || '' });

            if (user && user.id !== id) throw setError(400, "username is already used")

            user = await this.findUser({ email: data?.email || '' });

            if (user && user.id !== id) throw setError(400, "email is already used")

            return await this.userRepo.update(id, data);

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
