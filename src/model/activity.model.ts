import { Service } from 'typedi';
import Model from "../app/model";
import BaseRepository from "../plugins/mysqldb";
import { setError } from '../utils/error-format';


export interface IActivity extends Model {
    taskId: number;
    activity: string;
    user1_Id: number;
    user2_Id: number

}

@Service()
export class ActivityRepository extends BaseRepository<IActivity>{
    constructor() {
        super("activities")
    }

    async find(item: Partial<IActivity>, option: any): Promise<any> {

        const { limit = 10, page = 1 } = option;

        try {
            const query = this.db(this.tableName)
                .leftJoin("users as user1", "user1.id", "=", "activities.user1_Id")
                .leftJoin("users as user2", "user2.id", "=", "activities.user2_Id")
                .select(
                    "activities.*",
                    "user1.username as user1",
                    "user2.username as user2"
                )
                .where(item)

            const activities = await query.clone()
                .limit(limit)
                .offset((page - 1) * limit)
                .orderBy("created_at", "desc");

            const count = await query.clone().count('activities.id as CNT').first();


            return {
                activities,
                count: count?.CNT
            }
        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }
}
