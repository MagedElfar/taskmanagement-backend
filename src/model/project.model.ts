import { Service } from 'typedi';
import Model from "../app/model";
import BaseRepository, { oneToManyMapped } from "../plugins/mysqldb";
import { setError } from '../utils/error-format';

export interface IProject extends Model {
    name: string,
    spaceId: number,
    userId: number
}


@Service()
export class ProjectRepository extends BaseRepository<IProject>{
    constructor() {
        super("projects")
    }


    async find(item: Partial<IProject>, option: any): Promise<any> {


        const {
            limit = 10,
            page = 1,
            term = null,
        } = option
        try {
            const query = this.db(this.tableName)

            if (item.spaceId) {
                query.where("spaceId", "=", item.spaceId)
            }

            if (term) {
                query.andWhere("name", "like", `%${term}%`)
            }

            const projects = await query.clone()
                .limit(limit)
                .offset((page - 1) * limit)
                .orderBy("created_at", "desc");

            const count = await query.clone().count('id as CNT').first();


            return {
                projects,
                count: count?.CNT
            }
        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }
}
