import { ProfileImageRepository } from './../model/profileImage.model';
import { UserRepository, IUser } from './../model/user.model';
import { Inject, Service } from "typedi";
import StorageService from './storage.services';
import { setError } from '../utils/error-format';
import ProfileServices from './profile.services';
import * as bcrypt from "bcrypt";

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

    async changePassword(userId: number, data: {
        password: string,
        new_password: string
    }) {
        try {

            const user = await this.findUser({ id: userId });

            const isSame = await bcrypt.compare(data.password, user.password);

            if (!isSame) throw setError(400, "Invalid Password");

            const newPassword = await bcrypt.hash(data.new_password, 10);


            await this.update(userId, { password: newPassword });

            return;

        } catch (error) {
            throw error
        }
    }
}
