import { Service } from 'typedi';
import Model from "../app/model";
import BaseRepository from "../plugins/mysqldb";
import { setError } from '../utils/error-format';


export interface IActivity extends Model {
    taskId: number;
    activity: string;
    user1_Id: number;
    user2_Id: number
    type?: string
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
                .leftJoin("profiles_images as image", "image.userId", "=", "user1.id")
                .leftJoin("profiles as profile1", "user1.id", "=", "profile1.userId")
                .leftJoin("profiles as profile2", "user2.id", "=", "profile2.userId")
                .select(
                    "activities.*",
                    "user1.username as user1",
                    "user2.username as user2",
                    "profile1.first_name as user1FirstName",
                    "profile1.last_name as user1LastName",
                    "profile2.first_name as user2FirstName",
                    "profile2.last_name as user2LastName",
                    "image.image_url as userImage"

                )
                .where(item)

            const data = await query.clone()
                .limit(limit)
                .offset((page - 1) * limit)
                .orderBy("created_at", "desc");

            const count = await query.clone().count('activities.id as CNT').first();


            return {
                data,
                count: count?.CNT
            }
        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }

    async findOne(id: number | Partial<IActivity>): Promise<IActivity> {
        try {
            const query = this.db(this.tableName)
                .leftJoin("users as user1", "user1.id", "=", "activities.user1_Id")
                .leftJoin("users as user2", "user2.id", "=", "activities.user2_Id")
                .leftJoin("profiles_images as image", "image.userId", "=", "user1.id")
                .leftJoin("profiles as profile1", "user1.id", "=", "profile1.userId")
                .leftJoin("profiles as profile2", "user2.id", "=", "profile2.userId")
                .select(
                    "activities.*",
                    "user1.username as user1",
                    "user2.username as user2",
                    "profile1.first_name as user1FirstName",
                    "profile1.last_name as user1LastName",
                    "profile2.first_name as user2FirstName",
                    "profile2.last_name as user2LastName",
                    "image.image_url as userImage"

                )


            if (typeof id === 'number') {
                query.where('activities.id', id)
            } else {
                Object.keys(id).forEach(key => {
                    id[`activities.${key}`] = id[key];

                    delete id[key]
                })
                query.where(id)
            }


            return await query.first()

        } catch (error) {
            console.log(error)
            throw setError(500, "database failure")
        }
    }
}
