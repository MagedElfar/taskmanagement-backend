import Model from "../app/model";
import BaseRepository from "../plugins/mysqldb";
import { IUser } from './user.model';

export enum Gender {
    MALE = "male",
    FEMALE = "female"
}

export interface IProfile extends Model {
    userId: number | IUser;
    first_name: string;
    last_name: string;
    phone: string;
    gender: Gender
}


export class ProfileRepository extends BaseRepository<IProfile>{
    constructor() {
        super("profiles")
    }
}
