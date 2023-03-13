import { Service } from 'typedi';
import Model from "../app/model";
import BaseRepository, { oneToManyMapped } from "../plugins/mysqldb";
import { setError } from '../utils/error-format';

export interface ISpace extends Model {
    owner: number;
    name: string
}


@Service()
export class SpaceRepository extends BaseRepository<ISpace>{
    constructor() {
        super("spaces")
    }


    async find(item: Partial<ISpace>, option: any): Promise<any> {

        const { userId = 0, limit = 10, page = 1, term = null } = option
        try {
            const query = this.db(this.tableName)
                .select("spaces.*")
                .leftJoin("teams as team", "team.space", "=", "spaces.id")
                .where("team.userId", "=", userId)

            console.log(term)

            if (term) query.where("spaces.name", "like", `%${term}%`)


            const spaces = await query.clone().limit(limit).offset((page - 1) * limit);

            const count = await query.clone().count('spaces.id as CNT').first();

            return {
                spaces,
                count: count?.CNT
            }
        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }

    async findOne(id: number | Partial<ISpace>): Promise<ISpace> {
        const db = this.db
        try {
            const query = this.db(this.tableName)
                .select(
                    "spaces.*",
                    "team.id as teamId",
                    "user.username",
                    "user.id as userId",
                    "userImg.image_url as userImage"
                )
                .leftJoin("teams as team", "team.space", "=", "spaces.id")
                .leftJoin("users as user", "user.id", "=", "team.userId")
                .leftJoin("profiles_images as userImg", "userImg.userId", "=", "user.id")

            typeof id === 'number'
                ? query.where('spaces.id', id)
                : Object.keys(id).includes("id") ? query.where({ "spaces.id": id.id }) : query.where(id)

            return query
                .options({ nestTables: true })

                .then(res => {
                    const combineData = res.map(item => {
                        return {
                            spaces: item.spaces,
                            team: {
                                ...item.team,
                                user: {
                                    ...item.user,
                                    ...item.userImg
                                }
                            }
                        }
                    })
                    return oneToManyMapped(combineData, "spaces", {
                        team: "oneToMany"
                    })
                })

        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }
}
