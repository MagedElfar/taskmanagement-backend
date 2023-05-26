import { Inject, Service } from "typedi";
import StorageService from './storage.services';

@Service()
export default class MediaServices {

    private readonly storageService: StorageService;

    constructor(

        @Inject() storageService: StorageService
    ) {
        this.storageService = storageService
    }


    async uploadMedia(url: string, folderName: string) {
        try {

            return await this.storageService.upload(url, folderName)

        } catch (error) {
            throw error;
        }
    }

    async deleteMedia(key: string) {
        try {

            await this.storageService.delete(key);

        } catch (error) {
            throw error;
        }
    }

}
