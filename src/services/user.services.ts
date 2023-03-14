import { ProfileImageRepository } from './../model/profileImage.model';
import { UserRepository, IUser } from './../model/user.model';
import { Inject, Service } from "typedi";
import StorageService from './storage.services';
import { setError } from '../utils/error-format';
import ProfileServices from './profile.services';

@Service()
export default class UserServices {
    private readonly userRepo: UserRepository;

    constructor(
        @Inject() userRepo: UserRepository,
    ) {
        this.userRepo = userRepo;
    }

    async findUser(id: number | Partial<IUser>) {
        try {
            return await this.userRepo.findUser(id);
        } catch (error) {
            throw error
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
            let user = await this.userRepo.findUser({ username: data.username });

            if (user && user.id !== id) throw setError(400, "username is already used")

            user = await this.userRepo.findUser({ email: data.email });

            if (user && user.id !== id) throw setError(400, "email is already used")

            return await this.userRepo.update(id, data);

        } catch (error) {
            throw error
        }
    }
}
