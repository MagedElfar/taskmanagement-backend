import { Service } from 'typedi';
import Model from "../app/model";
import BaseRepository from "../plugins/mysqldb";

export enum Gender {
    MALE = "male",
    FEMALE = "female"
}

export interface IProfile extends Model {
    userId: number;
    first_name: string;
    last_name: string;
    phone: string;
    gender: Gender
}


@Service()
export class ProfileRepository extends BaseRepository<IProfile>{
    constructor() {
        super("profiles")
    }
}
