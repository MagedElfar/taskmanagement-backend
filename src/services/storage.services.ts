import { Service } from "typedi";
import config from "../config";
import fs from "fs";
import { v2 as cloudinary, ConfigOptions } from "cloudinary";

@Service()
export default class StorageService {

    // private readonly cloudConfig: ConfigOptions;

    constructor() {
        cloudinary.config({
            api_key: config.cloud.apiKey,
            api_secret: config.cloud.apiSecret,
            cloud_name: config.cloud.cloudName
        })
    }


    async upload(file: string, folder: string) {
        const localPath = `${config.mediaPath}/${file}`;

        try {
            const res = await cloudinary.uploader.upload(
                localPath,
                { "public_id": `${folder}/${file}` }
            )

            fs.unlinkSync(`${config.mediaPath}/${file}`)

            return res;
        } catch (error) {
            fs.unlinkSync(`${config.mediaPath}/${file}`)
            throw error
        }
    }

    async delete(public_id: string) {
        try {
            await cloudinary.uploader.destroy(public_id)
        } catch (error) {
            throw error
        }
    }
}