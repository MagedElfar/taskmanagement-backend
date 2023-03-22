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
}
