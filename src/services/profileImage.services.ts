import { ProfileImageRepository } from './../model/profileImage.model';
import { Inject, Service } from "typedi";
import StorageService from './storage.services';
import { setError } from '../utils/error-format';

@Service()
export default class ProfileImageServices {
    private readonly profileImageRepo: ProfileImageRepository;
    private readonly storageService: StorageService;

    constructor(

        @Inject() profileImageRepo: ProfileImageRepository,
        @Inject() storageService: StorageService
    ) {
        this.profileImageRepo = profileImageRepo;
        this.storageService = storageService
    }


    async userImage(image_url: string, userId: number) {
        try {
            const userImg = await this.profileImageRepo.findOne({ userId });

            const storageData: any = await this.storageService.upload(image_url, "users")

            if (userImg) {

                await this.storageService.delete(userImg.storage_key);

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

            await this.storageService.delete(userImg.storage_key);

            await this.profileImageRepo.delete(userImg.id)

        } catch (error) {
            throw error;
        }
    }

}
