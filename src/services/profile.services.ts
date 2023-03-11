import { ProfileRepository, IProfile } from './../model/profile.model';
import { Inject, Service } from "typedi";
import { setError } from '../utils/error-format';

@Service()
export default class ProfileServices {
    private readonly profileRepo: ProfileRepository;


    constructor(@Inject() profileRepo: ProfileRepository) {
        this.profileRepo = profileRepo;
    }

    async isExist(data: Partial<IProfile>) {
        try {
            return await this.profileRepo.isExist({ userId: data.userId })
        } catch (error) {
            throw error;
        }
    }

    async create(userId: number, data: Partial<IProfile>) {
        try {
            const haveProfile = await this.isExist({ userId });

            if (haveProfile) throw setError(400, "user already has profile")

            return await this.profileRepo.create({
                ...data,
                userId
            });
        } catch (error) {
            throw error;
        }
    }

    async update(userId: number, data: Partial<IProfile>) {
        try {
            const userProfile = await this.profileRepo.findOne({ userId })

            if (!userProfile) return this.create(userId, data)

            return await this.profileRepo.update(userProfile.id, data)
        } catch (error) {
            throw error
        }
    }
}
