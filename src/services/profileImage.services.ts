import { ProfileImageRepository } from '../model/profileImage.model';
import { Inject, Service } from "typedi";
import { setError } from '../utils/error-format';
import MediaServices from './media.services';

@Service()
export default class ProfileImageServices {
    private readonly profileImageRepo: ProfileImageRepository;
    private readonly mediaServices: MediaServices;

    constructor(

        @Inject() profileImageRepo: ProfileImageRepository,
        @Inject() mediaServices: MediaServices
    ) {
        this.profileImageRepo = profileImageRepo;
        this.mediaServices = mediaServices
    }


    async userImage(image_url: string, userId: number) {
        try {
            const userImg = await this.profileImageRepo.findOne({ userId });

            const storageData: any = await this.mediaServices.uploadMedia(image_url, "users")

            if (userImg) {

                await this.mediaServices.deleteMedia(userImg.storage_key);

                return await this.profileImageRepo.update(userImg.id, {
                    image_url: storageData.secure_url,
                    storage_key: storageData.public_id
                });

            } else {

                return await this.profileImageRepo.create({
                    userId,
                    image_url: storageData.secure_url,
                    storage_key: storageData.public_id
                })
            }
        } catch (error) {
            throw error;
        }
    }

    async delEteUserImage(userId: number) {
        try {
            const userImg = await this.profileImageRepo.findOne({ userId });

            if (!userImg) throw setError(404, "not found")

            await this.mediaServices.deleteMedia(userImg.storage_key);

            await this.profileImageRepo.delete(userImg.id)

        } catch (error) {
            throw error;
        }
    }

}
