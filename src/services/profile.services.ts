import { UpdateProfileDto, CreateProfileDto } from '../dto/profile.dto';
import { ProfileRepository, IProfile } from '../model/profile.model';
import { setError } from '../utils/error-format';
import { autoInjectable, container } from 'tsyringe';

export interface IProfileServices {
    isExist(data: Partial<IProfile>): Promise<boolean>;
    create(createProfileDto: CreateProfileDto): Promise<IProfile>;
    update(updateProfileDto: UpdateProfileDto): Promise<IProfile>
}

@autoInjectable()
export class ProfileServices implements IProfileServices {

    private readonly profileRepo: ProfileRepository;

    constructor(profileRepo: ProfileRepository) {
        this.profileRepo = profileRepo;
    }

    async isExist(data: Partial<IProfile>) {
        try {
            return await this.profileRepo.isExist({ userId: data.userId })
        } catch (error) {
            throw error;
        }
    }

    async create(createProfileDto: CreateProfileDto) {
        try {
            const haveProfile = await this.isExist({ userId: createProfileDto.userId });

            if (haveProfile) throw setError(400, "user already has profile")

            return await this.profileRepo.create(createProfileDto);
        } catch (error) {
            throw error;
        }
    }

    async update(updateProfileDto: UpdateProfileDto) {
        try {
            const userProfile = await this.profileRepo.findOne({ userId: updateProfileDto.userId })

            if (!userProfile) return this.create(updateProfileDto)

            return await this.profileRepo.update(userProfile.id, updateProfileDto)
        } catch (error) {
            throw error
        }
    }
}


container.register<IProfileServices>("IProfileServices", { useClass: ProfileServices });

const profileService = container.resolve(ProfileServices);

export default profileService;