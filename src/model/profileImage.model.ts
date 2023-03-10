import { Service } from 'typedi';
import Model from "../app/model";
import BaseRepository from "../plugins/mysqldb";

export interface IProfileImage extends Model {
    userId: number;
    image_url: string,
    storage_key: string
}

@Service()
export class ProfileImageRepository extends BaseRepository<IProfileImage>{
    constructor() {
        super("profiles_images")
    }
}
