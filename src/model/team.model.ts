import { Service } from 'typedi';
import Model from "../app/model";
import BaseRepository from "../plugins/mysqldb";
import { setError } from '../utils/error-format';

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

    async findOne(id: number | Partial<ITeam>): Promise<any> {
        try {
            const query = this.qb()
                .leftJoin("spaces", "spaces.id", "=", "teams.space")
                .select("teams.*", "spaces.owner as spaceOwner")
            return typeof id === 'number'
                ? await query.where('teams.id', id).first()
                : Object.keys(id).includes("id") ? query.where({ "teams.id": id.id }) : query.where(id).first()
        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }

}
