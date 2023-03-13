import { Service } from 'typedi';
import Model from "../app/model";
import BaseRepository from "../plugins/mysqldb";

export enum Role {
    OWNER = "owner",
    ADMIN = "admin",
    MEMBER = "member"
}

export interface ITeam extends Model {
    space: number;
    userId: number;
    role: Role
}


@Service()
export class TeamRepository extends BaseRepository<ITeam>{
    constructor() {
        super("teams")
    }
}
