import Model from "../app/model";
import BaseRepository from "../plugins/mysqldb";
import { Service } from "typedi";

export interface IUser extends Model {
    username: string;
    email: string;
    password: string;
}

@Service()
export class UserRepository extends BaseRepository<IUser>{
    constructor() {
        super("users")
    }
}
