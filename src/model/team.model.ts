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

    async find(item: Partial<ITeam>, option: any): Promise<any> {

        const { limit = 5, page = 1 } = option
        try {
            const query = this.db(this.tableName)
                .leftJoin("users as user", "user.id", "=", "teams.userId")
                .leftJoin("profiles_images as userImg", "userImg.userId", "=", "user.id")
                .select(
                    "teams.*",
                    "userImg.image_url as userImage",
                    "user.username",
                    "user.email as userEmail"
                )
                .where("teams.space", "=", item.space!)

            const team = await query.clone().limit(limit).offset((page - 1) * limit);

            const count = await query.clone().count('teams.id as CNT').first();

            return {
                team,
                count: count?.CNT
            }
        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
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
